use std::collections::HashMap;
use std::sync::Mutex;
use pty::PtyProcess;

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
    tauri::Builder::default()
        .manage(JexpeState::new())
        .invoke_handler(tauri::generate_handler![
        ])
        .run(tauri::generate_context!())
        .expect("error while running jexpe application");
}
