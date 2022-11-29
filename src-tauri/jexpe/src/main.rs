use std::sync::Mutex;
use tauri::{AppHandle, State};
use jexpe_vault::{Group, Host, vault};
use vault::Repo;

mod errors;

struct JexpeVault {
    repo: Mutex<Option<Repo>>,
}

#[tauri::command]
fn open_vault(
    app_handle: AppHandle,
    jexpe_vault: State<JexpeVault>,
    master_password: String,
) -> Result<String, String> {
    let app_data_dir = app_handle.path_resolver().app_data_dir()
        .unwrap();
    let path = app_data_dir.into_os_string().into_string().unwrap();

    let repo = vault::open(&path, "default", master_password);
    match repo {
        Ok(repo) => {
            *jexpe_vault.repo.lock().unwrap() = Some(repo);
            Ok("Success!".to_string())
        }
        Err(_e) => {
            Err("Invalid password!".to_string())
        }
    }
}

fn main() {
    jexpe_vault::init();

    tauri::Builder::default()
        .manage(JexpeVault { repo: Mutex::new(None) })
        .invoke_handler(tauri::generate_handler![open_vault])
        .run(tauri::generate_context!())
        .expect("error while running jexpe application");
}
