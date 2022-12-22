use std::io::{Read, Write};
use crossbeam_channel::{TryRecvError, unbounded};
use tauri::{AppHandle, Manager, State};
use portable_pty::{CommandBuilder, NativePtySystem, PtySize, PtySystem};
use crate::{JexpeState, pty};
use crate::pty::{PtyOutputPayload, SystemShell, WritableMasterPty};

#[tauri::command]
pub fn get_available_system_shells() -> Vec<SystemShell> {
    let mut shells = Vec::new();

    if cfg!(target_os = "windows") {
        shells.push(SystemShell {
            display_name: "Windows PowerShell".to_string(),
            icon: "https://img.icons8.com/color/48/null/powershell.png".to_string(),
            binary: "powershell.exe".to_string(),
        });
        shells.push(SystemShell {
            display_name: "Command Prompt".to_string(),
            icon: "https://img.icons8.com/fluency/48/null/console.png".to_string(),
            binary: "cmd.exe".to_string(),
        });
        shells.push(SystemShell {
            display_name: "Git Bash".to_string(),
            icon: "https://img.icons8.com/color/48/null/git.png".to_string(),
            binary: "bash.exe".to_string(),
        });
        shells.push(SystemShell {
            display_name: "Ubuntu - WSL".to_string(),
            icon: "https://img.icons8.com/color/48/null/ubuntu.png".to_string(),
            binary: "wsl.exe".to_string(),
        });
    }

    shells
}

#[tauri::command]
pub fn open_pty(
    app_handle: AppHandle,
    state: State<JexpeState>,
    shell: SystemShell,
) -> Result<String, String> {
    let id = cuid::cuid().unwrap();

    let pty_system = NativePtySystem::default();
    let pair = pty_system.openpty(PtySize {
        rows: 24,
        cols: 80,
        pixel_width: 0,
        pixel_height: 0,
    }).unwrap();

    let cmd = CommandBuilder::new(&shell.binary);
    let mut child = pair.slave.spawn_command(cmd).unwrap();

    drop(pair.slave);

    let (tx, rx) = unbounded::<Vec<u8>>();

    let mut reader = pair.master.try_clone_reader().unwrap();
    let mut writer = pair.master.take_writer().unwrap();

    let pty_id = id.clone();
    std::thread::spawn(move || {
        loop {
            let mut buf = [0u8; 1024];
            match reader.read(&mut buf) {
                // the channel has closed and we got an EOF
                Ok(0) => break,
                // We got some data; try to decode it as utf-8
                Ok(c) => {
                    let slice = &buf[0..c];
                    match std::str::from_utf8(slice) {
                        Ok(data) => {
                            app_handle.emit_all("pty-output", PtyOutputPayload {
                                id: pty_id.clone(),
                                data: data.to_string(),
                            }).unwrap();
                        }
                        Err(e) => {
                            // TODO: you should buffer this up and try to stick it together
                            // with the next chunk of data that you read later on
                            eprintln!("Error output was not utf8: {}", e);
                            break;
                        }
                    }
                }
                Err(e) => {
                    println!("Error while reading: {}", e);
                    break;
                }
            }
        }
    });

    std::thread::spawn(move || {
        while let Ok(input) = rx.recv() {
            writer.write(input.as_ref()).unwrap();
            writer.flush().unwrap();
        }
    });

    state.ptys.lock().unwrap().insert(id.clone(), WritableMasterPty {
        master: pair.master,
        tx,
    });
    Ok(id)
}

#[tauri::command]
pub fn write_to_pty(
    state: State<JexpeState>,
    id: String,
    input: String,
) -> Result<(), String> {
    let mut ptys = state.ptys.lock().unwrap();
    let pty = ptys.get(&id).unwrap();
    pty.tx.send(input.into_bytes()).unwrap();
    Ok(())
}