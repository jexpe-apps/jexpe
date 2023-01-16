use cuid::cuid;
use portable_pty::{CommandBuilder, native_pty_system, PtySize};
use tauri::{AppHandle, Manager, State};
use tokio::sync::mpsc::channel;
use tokio::task::spawn_blocking;
use tokio::time::sleep;
use crate::JexpeState;
use crate::shell::SystemShell;
use super::{PtyProcess, PtyExitPayload, PtyStdoutPayload, PtySpawnPayload};
use super::constants::{MAX_PIPE_CHUNK_SIZE, READ_PAUSE_DURATION};

#[tauri::command]
pub async fn spawn_pty(
    app_handle: AppHandle,
    state: State<'_, JexpeState>,
    shell: SystemShell,
) -> Result<(), String> {
    let id = cuid()
        .map_err(|_| "Failed to generate cuid.".to_string())?;

    // Establish our new pty for the given size
    let pty_system = native_pty_system();
    let pty_pair = pty_system.openpty(PtySize::default())
        .map_err(|x| x.to_string())?;

    let pty_master = pty_pair.master;
    let pty_slave = pty_pair.slave;

    // Spawn our process within the pty
    let mut cmd = CommandBuilder::new(shell.command.clone());
    // cmd.args(args);

    cmd.cwd(shell.directory.clone());

    // if let Some(environment) = environment {
    //     for (key, value) in environment {
    //         cmd.env(key, value)
    //     }
    // }

    let mut child = pty_slave
        .spawn_command(cmd)
        .map_err(|x| x.to_string())?;

    // NOTE: Need to drop slave to close out file handles and avoid deadlock when waiting on the child
    drop(pty_slave);

    // Spawn a thread to wait input from frontend and write to the pty
    let (stdin_tx, mut stdin_rx) = channel::<Vec<u8>>(1);
    let mut stdin_writer = pty_master
        .take_writer()
        .map_err(|x| x.to_string())?;

    let stdin_task = spawn_blocking(move || {
        while let Some(input) = stdin_rx.blocking_recv() {
            if stdin_writer.write_all(&input).is_err() {
                break;
            }
        }
    });

    // Spawn a thread to read from the pty and send the output to the frontend
    let mut stdout_reader = pty_master
        .try_clone_reader()
        .map_err(|x| x.to_string())?;

    let app_handle_clone = app_handle.clone();
    let id_clone = id.clone();
    let stdout_task = spawn_blocking(move || {
        let mut buf: [u8; MAX_PIPE_CHUNK_SIZE] = [0; MAX_PIPE_CHUNK_SIZE];
        loop {
            match stdout_reader.read(&mut buf) {
                Ok(n) if n > 0 => {
                    app_handle_clone
                        .emit_all("pty-stdout", PtyStdoutPayload {
                            id: id_clone.clone(),
                            bytes: buf[..n].to_vec(),
                        })
                        .unwrap();
                }
                _ => { break; }
            }
        }
    });

    // Wait for the child to exit and send the exit code to the frontend
    let (kill_tx, mut kill_rx) = channel::<()>(1);

    // Update the state with the new pty process
    {
        let mut ptys = state.ptys.lock().await;
        ptys.insert(id.clone(), PtyProcess {
            id: id.clone(),
            pty_master,
            stdin_tx,
            kill_tx,
            stdin_task,
            stdout_task,
        });

        app_handle
            .emit_all("pty-spawn", PtySpawnPayload {
                id: id.clone(),
                shell: shell.clone(),
            })
            .unwrap();

        println!("[TAURI]: Successfully spawned pty ({}).", id.clone());
    }

    loop {
        match (child.try_wait(), kill_rx.try_recv()) {
            (Ok(Some(status)), _) => {
                app_handle
                    .emit_all("pty-exit", PtyExitPayload {
                        id: id.clone(),
                        success: status.success(),
                        code: Some(status.exit_code()),
                    }).unwrap();
                break;
            }

            (_, Ok(_)) => {
                app_handle
                    .emit_all("pty-exit", PtyExitPayload {
                        id: id.clone(),
                        success: true,
                        code: None,
                    }).unwrap();
                break;
            }

            (Err(_), _) => {
                app_handle
                    .emit_all("pty-exit", PtyExitPayload {
                        id: id.clone(),
                        success: false,
                        code: None,
                    }).unwrap();
                break;
            }

            _ => {
                sleep(READ_PAUSE_DURATION).await;
                continue;
            }
        }
    }

    let mut ptys = state.ptys.lock().await;
    if let Some(pty) = ptys.remove(&id) {

        // Need to drop the stdin_tx to avoid deadlock when waiting on stdin_task
        drop(pty.stdin_tx);

        // Need to drop the kill_tx to drop also the kill_rx
        drop(pty.kill_tx);

        // Need to drop the pty_master to close out file handles and avoid deadlock when waiting on stdout_task
        drop(pty.pty_master);

        pty.stdin_task.await.unwrap();
        pty.stdout_task.await.unwrap();

        println!("[TAURI]: Successfully dropped pty ({}).", id.clone());
    }

    Ok(())
}

#[tauri::command]
pub async fn write_pty(
    state: State<'_, JexpeState>,
    id: String,
    data: String,
) -> Result<(), String> {
    let mut ptys = state.ptys.lock().await;

    let pty = ptys.get_mut(&id)
        .ok_or("The specified ID is not associated with any pty.")?;

    pty.stdin_tx.send(data.into_bytes())
        .await
        .map_err(|x| x.to_string())?;

    Ok(())
}

#[tauri::command]
pub async fn resize_pty(
    state: State<'_, JexpeState>,
    id: String,
    size: PtySize,
) -> Result<(), String> {
    let ptys = state.ptys.lock().await;

    let pty = ptys.get(&id)
        .ok_or("The specified ID is not associated with any pty.")?;

    pty.pty_master.resize(size)
        .map_err(|x| x.to_string())?;

    Ok(())
}

#[tauri::command]
pub async fn kill_pty(
    state: State<'_, JexpeState>,
    id: String,
) -> Result<(), String> {
    let mut ptys = state.ptys.lock().await;

    let pty = ptys.get_mut(&id)
        .ok_or("The specified ID is not associated with any pty.")?;

    pty.kill_tx.send(())
        .await
        .map_err(|x| x.to_string())?;

    Ok(())
}