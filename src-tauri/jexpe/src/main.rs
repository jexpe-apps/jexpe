use std::collections::HashMap;
use std::sync::Mutex;
use tauri::{AppHandle, Manager, State, WindowEvent};
use crate::pty::{SystemShell, WritableMasterPty};

mod pty;

pub struct JexpeState {
    ptys: Mutex<HashMap<String, WritableMasterPty>>,
}

impl JexpeState {
    fn new() -> Self {
        Self {
            ptys: Mutex::new(HashMap::new()),
        }
    }
}

fn main() {
    tauri::Builder::default()
        .manage(JexpeState::new())
        .invoke_handler(tauri::generate_handler![
            pty::commands::get_available_system_shells,
            pty::commands::open_pty,
            pty::commands::write_to_pty
        ])
        .run(tauri::generate_context!())
        .expect("error while running jexpe application");
}
