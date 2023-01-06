use std::collections::HashMap;
use std::sync::Arc;
use tokio::sync::{Mutex};

use pty::{PtyProcess};

mod shell;


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
        ])
        .run(tauri::generate_context!())
        .expect("error while running jexpe application");
}
