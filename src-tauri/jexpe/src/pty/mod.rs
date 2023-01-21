use portable_pty::MasterPty;
use serde::{Deserialize, Serialize};
use tokio::sync::mpsc::Sender;
use tokio::task::JoinHandle;
use crate::shell::SystemShell;

mod constants;
pub mod commands;

#[derive(Serialize, Deserialize, Clone)]
struct PtyStdoutPayload {
    id: String,
    bytes: Vec<u8>,
}

#[derive(Serialize, Deserialize, Clone)]
struct PtyExitPayload {
    id: String,
    success: bool,
    code: Option<u32>,
}

#[derive(Serialize, Deserialize, Clone)]
struct PtySpawnPayload {
    id: String,
    shell: SystemShell,
}

pub struct PtyProcess {
    id: String,
    pty_master: Box<dyn MasterPty + Send>,
    stdin_tx: Sender<Vec<u8>>,
    kill_tx: Sender<()>,
    stdin_task: JoinHandle<()>,
    stdout_task: JoinHandle<()>,
}