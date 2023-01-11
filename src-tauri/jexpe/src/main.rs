use std::collections::HashMap;
use std::sync::Arc;
use tauri::Manager;
use tokio::sync::{Mutex};

use pty::{PtyProcess};

mod beta_pty;
mod shell;

use window_vibrancy::{apply_blur, apply_vibrancy, NSVisualEffectMaterial};

pub struct JexpeState {
    ptys: Mutex<HashMap<String, Arc<Mutex<PtyProcess>>>>,
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
            shell::commands::get_system_shells,
            shell::commands::spawn_pty,
            shell::commands::write_pty,
            shell::commands::kill_pty,
            shell::commands::resize_pty,
        ])
        .run(tauri::generate_context!())
        .expect("error while running jexpe application");
}
