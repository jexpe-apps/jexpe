use cuid::cuid;
use portable_pty::{CommandBuilder, native_pty_system};
use tauri::{AppHandle, Manager, State};
use pty::{PtyProcess, PtySize};
use crate::JexpeState;
use crate::beta_pty::{SystemShell};

#[tauri::command]
pub async fn spawn_pty(
    app_handle: AppHandle,
    state: State<'_, JexpeState>,
    id: String,
    shell: SystemShell,
) -> Result<String, String> {
    let id = cuid()
        .map_err(|_| "Failed to generate cuid.".to_string())?;

    // Establish our new pty for the given size
    let pty_system = native_pty_system();
    let pty_pair = pty_system.openpty(PtySize::default())
        .map_err(|x| x.to_string())?;

    let pty_master = pty_pair.master;
    let pty_slave = pty_pair.slave;

    // Spawn our process within the pty
    let mut cmd = CommandBuilder::new(shell.command);
    // cmd.args(args);

    cmd.cwd(shell.directory);

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

    Ok(id)
}