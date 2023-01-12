use std::collections::HashMap;
use std::sync::Arc;
use tokio::sync::{Mutex};

use pty::{PtyProcess};
use crate::beta_pty::LocalPtyProcess;

mod beta_pty;
mod shell;

pub struct JexpeState {
    beta_ptys: Mutex<HashMap<String, LocalPtyProcess>>,
    ptys: Mutex<HashMap<String, Arc<Mutex<PtyProcess>>>>,
}

impl JexpeState {
    fn new() -> Self {
        Self {
            ptys: Mutex::new(HashMap::new()),
            beta_ptys: Mutex::new(HashMap::new()),
        }
    }
}

fn main() {
    tauri::Builder::default()
        .manage(JexpeState::new())
        .invoke_handler(tauri::generate_handler![
            shell::commands::get_system_shells,
            shell::commands::spawn_pty,
            shell::commands::write_pty,
            shell::commands::kill_pty,
            shell::commands::resize_pty,
            beta_pty::commands::beta_spawn_pty,
            beta_pty::commands::beta_write_pty,
        ])
        .run(tauri::generate_context!())
        .expect("error while running jexpe application");
}
