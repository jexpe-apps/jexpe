use std::collections::HashMap;
use serde::{Deserialize, Serialize};

pub mod commands;

#[cfg(target_os = "windows")]
mod windows;

#[derive(Serialize, Deserialize, Clone)]
struct PtyStdoutPayload {
    id: String,
    bytes: Vec<u8>,
}

#[derive(Serialize, Deserialize, Clone)]
pub struct SystemShell {
    pub id: String,
    pub name: String,
    pub command: String,
    pub args: Vec<String>,
    pub env: HashMap<String, String>,
    pub cwd: Option<String>,
    pub icon: String,
}