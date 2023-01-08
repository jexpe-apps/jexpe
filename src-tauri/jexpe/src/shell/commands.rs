use std::sync::{Arc};
use tauri::{AppHandle, Manager, State};
use tauri::async_runtime::spawn;
use tokio::sync::Mutex;
use pty::{PtyProcess, PtySize};
use crate::JexpeState;
use crate::shell::{SystemShellPayload, PtyStdoutPayload};

#[tauri::command]
pub fn get_system_shells() -> Result<Vec<SystemShellPayload>, String> {
    let mut shells = Vec::new();

    if cfg!(target_os = "windows") {
        shells.push(SystemShellPayload {
            display_name: "Command Prompt".to_string(),
            icon: "https://raw.githubusercontent.com/microsoft/terminal/main/src/cascadia/CascadiaPackage/ProfileIcons/%7B0caa0dad-35be-5f56-a8ff-afceeeaa6101%7D.scale-200.png".to_string(),
            command: "cmd.exe".to_string(),
            directory: "%USERPROFILE%".to_string(),
        });

        shells.push(SystemShellPayload {
            display_name: "Windows PowerShell".to_string(),
            icon: "https://raw.githubusercontent.com/microsoft/terminal/main/src/cascadia/CascadiaPackage/ProfileIcons/%7B61c54bbd-c2c6-5271-96e7-009a87ff44bf%7D.scale-200.png".to_string(),
            command: "powershell.exe".to_string(),
            directory: "%USERPROFILE%".to_string(),
        });

        shells.push(SystemShellPayload {
            display_name: "Git Bash".to_string(),
            icon: "https://git-scm.com/images/logos/downloads/Git-Icon-1788C.png".to_string(),
            command: "bash.exe -l -i".to_string(),
            directory: "%USERPROFILE%".to_string(),
        });

        shells.push(SystemShellPayload {
            display_name: "Ubuntu".to_string(),
            icon: "https://assets.ubuntu.com/v1/49a1a858-favicon-32x32.png".to_string(),
            command: "wsl.exe -d Ubuntu".to_string(),
            directory: "~".to_string(),
        });
    }

    // TODO: Add support for other systems

    Ok(shells)
}


#[tauri::command]
pub async fn spawn_pty(
    app_handle: AppHandle,
    state: State<'_, JexpeState>,
    id: String,
    shell: SystemShellPayload,
    size: PtySize,
) -> Result<String, String> {
    // let id = cuid()
    //     .map_err(|_| "Failed to generate cuid".to_string())?;

    let pty = PtyProcess::spawn(
        shell.command.clone(),
        None,
        None,
        size,
    ).map_err(|e| e.to_string())?;

    let pty = Arc::new(Mutex::new(pty));

    {
        let mut ptys = state.ptys.lock().await;
        ptys.insert(id.clone(), Arc::clone(&pty));
    }

    let mut pty = pty.lock().await;

    let mut stdout = pty.take_stdout()
        .ok_or("Failed to take stdout from pty".to_string())?;

    let mut wait = pty.take_wait()
        .ok_or("Failed to take wait from pty".to_string())?;

    let pty_stdin_task = pty.stdin_task.take()
        .ok_or("Failed to take stdin task from pty".to_string())?;

    let pty_stdout_task = pty.stdout_task.take()
        .ok_or("Failed to take stdout task from pty".to_string())?;

    drop(pty);

    let id_clone = id.clone();
    let stdout_task = spawn(async move {
        while let Ok(data) = stdout.recv().await {
            match data {
                Some(bytes) => {

                    // Uncomment this to see the bytes being sent to the frontend
                    // let mut os_stdout = io::stdout().lock();
                    // os_stdout.write(bytes.as_slice()).unwrap();
                    // os_stdout.flush().unwrap();

                    app_handle
                        .emit_all("pty-stdout", PtyStdoutPayload {
                            id: id_clone.clone(),
                            bytes,
                        })
                        .unwrap();
                }
                None => {
                    continue;
                }
            }
        }
    });

    let mut status = wait.recv().await
        .map_err(|_| "Failed to receive status from pty".to_string())?;

    {
        let mut ptys = state.ptys.lock().await;
        let mut pty = ptys.get_mut(&id)
            .ok_or("Pty not found".to_string())?
            .lock()
            .await;

        let _ = pty.pty_master.take()
            .ok_or("Failed to take master from pty".to_string())?;
    }

    pty_stdin_task.abort();
    let _ = pty_stdout_task.await;
    stdout_task.abort();

    if status.success && status.code.is_none() {
        status.code = Some(0);
    }

    println!("PTY exited with status: {:?}", status);

    Ok("Ok!".into())
}

#[tauri::command]
pub async fn write_pty(
    state: State<'_, JexpeState>,
    id: String,
    data: String,
) -> Result<(), String> {
    let mut ptys = state.ptys.lock().await;

    let mut pty = ptys.get_mut(&id)
        .ok_or("Pty not found".to_string())?
        .lock()
        .await;

    let stdin = pty.mut_stdin()
        .ok_or("Failed to get stdin".to_string())?;

    stdin.send(data.as_bytes())
        .await
        .map_err(|_| "Failed to write to stdin".to_string())?;

    Ok(())
}

#[tauri::command]
pub async fn kill_pty(
    state: State<'_, JexpeState>,
    id: String,
) -> Result<(), String> {
    let mut ptys = state.ptys.lock().await;

    let mut pty = ptys.get_mut(&id)
        .ok_or("Pty not found".to_string())?
        .lock()
        .await;

    pty.kill()
        .await
        .map_err(|_| "Failed to kill pty".to_string())?;

    Ok(())
}

#[tauri::command]
pub async fn resize_pty(
    state: State<'_, JexpeState>,
    id: String,
    size: PtySize,
) -> Result<(), String> {
    let mut ptys = state.ptys.lock().await;

    let mut pty = ptys.get_mut(&id)
        .ok_or("Pty not found".to_string())?
        .lock()
        .await;

    pty.resize(size)
        .map_err(|x| x.to_string())?;

    Ok(())
}