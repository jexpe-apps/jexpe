use std::collections::HashMap;
use tauri::Builder;
use tokio::sync::{Mutex};

use crate::pty::PtyProcess;

mod pty;
mod shell;

pub struct JexpeState {
    ptys: Mutex<HashMap<String, PtyProcess>>,
}

impl JexpeState {
    fn new() -> Self {
        Self {
            ptys: Mutex::new(HashMap::new()),
        }
    }
}


fn main() {
    Builder::default()
        .manage(JexpeState::new())
        .invoke_handler(tauri::generate_handler![
            shell::commands::get_system_shells,
            pty::commands::spawn_pty,
            pty::commands::write_pty,
            pty::commands::resize_pty,
            pty::commands::kill_pty,
        ])
        .run(tauri::generate_context!())
        .expect("error while running jexpe application");
}
