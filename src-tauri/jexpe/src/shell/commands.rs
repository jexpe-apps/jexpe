use cuid::cuid;
use tauri::async_runtime::spawn;
use tauri::{AppHandle, Manager, State};
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

    let mut pty = PtyProcess::spawn(
        command,
        [],
        None,
        None,
        PtySize {
            rows: 29,
            cols: 104,
            pixel_width: 0,
            pixel_height: 0,
        },

    ).map_err(|_| "Failed to spawn pty".to_string())?;

    if let Some(mut stdout) = pty.take_stdout() {
        let id = id.clone();
        let stdout_task = spawn(async move {
            while let Ok(data) = stdout.recv().await {
                match data {
                    Some(bytes) => {
                        app_handle
                            .emit_all("pty-stdout", PtyStdoutPayload {
                                id: id.clone(),
                                bytes,
                            })
                            .unwrap();
                    }
                    None => { continue; }
                }
            }
        });
    }

    let mut ptys = state.ptys.lock().await;
    // .map_err(|_| "Failed to lock ptys".to_string())?;

    ptys.insert(id.clone(), pty);

    Ok(id)
}

#[tauri::command]
pub async fn write_shell(
    state: State<'_, JexpeState>,
    id: String,
    data: String,
) -> Result<(), String> {
    let mut ptys = state.ptys.lock().await;
    // .map_err(|_| "Failed to lock ptys".to_string())?;

    let pty = ptys.get_mut(&id)
        .ok_or("Pty not found".to_string())?;

    let stdin = pty.mut_stdin()
        .ok_or("Failed to get stdin".to_string())?;

    stdin.send(data.as_bytes())
        .await
        .map_err(|_| "Failed to write to stdin".to_string())?;

    Ok(())
}