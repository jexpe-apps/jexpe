use serde::{Deserialize, Serialize};

pub mod commands;

#[derive(Serialize, Deserialize, Clone)]
struct PtyStdoutPayload {
    id: String,
    bytes: Vec<u8>,
}

#[derive(Serialize, Deserialize, Clone)]
pub struct SystemShell {
    pub display_name: String,
    pub icon: String,
    pub command: String,
    pub directory: String,
}