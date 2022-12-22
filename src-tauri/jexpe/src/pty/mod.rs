use std::borrow::Cow;
use crossbeam_channel::unbounded;
use portable_pty::{Child, CommandBuilder, MasterPty, NativePtySystem, PtySize, PtySystem};
use serde::{Deserialize, Serialize};

pub mod commands;

#[derive(Serialize, Deserialize, Debug)]
pub struct SystemShell {
    pub display_name: String,
    pub icon: String,
    pub binary: String,
}

#[derive(Serialize, Deserialize, Clone, Debug)]
struct PtyOutputPayload {
    id: String,
    data: String,
}


pub struct WritableMasterPty {
    master: Box<dyn MasterPty + Send>,
    tx: crossbeam_channel::Sender<Vec<u8>>,
}
