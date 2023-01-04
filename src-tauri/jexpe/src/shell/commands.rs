use std::sync::{Arc};

use cuid::cuid;
use tauri::{AppHandle, Manager, State};
use tauri::async_runtime::spawn;
use tokio::sync::Mutex;

use pty::{PtyProcess, PtySize};

use crate::JexpeState;
use crate::shell::{OsShellPayload, PtyStdoutPayload};

#[tauri::command]
pub fn get_os_shells() -> Result<Vec<OsShellPayload>, String> {
    let mut shells = Vec::new();

    if cfg!(target_os = "windows") {
        shells.push(OsShellPayload {
            display_name: "Windows PowerShell".to_string(),
            icon: "https://img.icons8.com/color/48/null/powershell.png".to_string(),
            command: "powershell.exe".to_string(),
        });

        shells.push(OsShellPayload {
            display_name: "Command Prompt".to_string(),
            icon: "https://img.icons8.com/fluency/48/null/console.png".to_string(),
            command: "cmd.exe".to_string(),
        });

        shells.push(OsShellPayload {
            display_name: "Git Bash".to_string(),
            icon: "https://img.icons8.com/color/48/null/git.png".to_string(),
            command: "bash.exe".to_string(),
        });

        shells.push(OsShellPayload {
            display_name: "WSL".to_string(),
            icon: "https://img.icons8.com/color/48/null/linux.png".to_string(),
            command: "wsl.exe".to_string(),
        });
    }

    // TODO: Add support for other OSes

    Ok(shells)
}

#[tauri::command]
pub async fn spawn_shell(
    app_handle: AppHandle,
    state: State<'_, JexpeState>,
    command: String,
) -> Result<String, String> {
    let id = cuid()
        .map_err(|_| "Failed to generate cuid".to_string())?;

    let pty = Arc::new(Mutex::new(
        PtyProcess::spawn(
            "C:/Program Files/Git/bin/bash.exe",
            ["-i", "-l"],
            None,
            None,
            PtySize {
                rows: 27, // TODO: Get actual terminal size
                cols: 119,
                pixel_width: 0,
                pixel_height: 0,
            },
        ).map_err(|_| "Failed to spawn pty".to_string())?
    ));

    {
        let mut ptys = state.ptys.lock().await;
        ptys.insert(id.clone(), Arc::clone(&pty));
    }

    app_handle.emit_all("pty-spawned", id.clone())
        .map_err(|_| "Failed to emit pty-spawned event".to_string())?;

    let mut pty = pty.lock().await;

    let mut stdout = pty.take_stdout()
        .ok_or("Failed to take stdout from pty".to_string())?;

    let mut wait = pty.take_wait()
        .ok_or("Failed to take wait from pty".to_string())?;

    let _ = pty.pty_master.take()
        .ok_or("Failed to take master from pty".to_string())?;

    let pty_stdin_task = pty.stdin_task.take()
        .ok_or("Failed to take stdin task from pty".to_string())?;

    let pty_stdout_task = pty.stdout_task.take()
        .ok_or("Failed to take stdout task from pty".to_string())?;

    drop(pty);

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
                            id: id.clone(),
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

    pty_stdin_task.abort();
    let _ = pty_stdout_task.await;
    let _ = stdout_task.await;

    if status.success && status.code.is_none() {
        status.code = Some(0);
    }

    println!("PTY exited with status: {:?}", status);

    Ok("Ok!".into())
}

#[tauri::command]
pub async fn write_shell(
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