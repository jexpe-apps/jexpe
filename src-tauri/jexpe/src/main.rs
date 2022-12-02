use jexpe_vault::{vault, Group, Host};
use std::sync::Mutex;
use tauri::{AppHandle, Manager, State, WindowEvent};
use vault::Repo;

struct JexpeVault {
    master_password: Mutex<Option<String>>,
}

impl JexpeVault {
    fn new() -> Self {
        Self {
            master_password: Mutex::new(None),
        }
    }
}

fn get_app_data_dir(app_handle: &AppHandle) -> String {
    let app_data_dir = app_handle.path_resolver().app_data_dir().unwrap();
    return app_data_dir.into_os_string().into_string().unwrap();
}

#[tauri::command]
fn unlock_vault(
    app_handle: AppHandle,
    jexpe_vault: State<JexpeVault>,
    master_password: String,
) -> Result<String, String> {
    let app_data_dir = get_app_data_dir(&app_handle);
    let repo = vault::open(&app_data_dir, "default", &master_password);
    match repo {
        Ok(_repo) => {
            *jexpe_vault.master_password.lock().unwrap() = Some(master_password);
            Ok("Success!".to_string())
        }
        Err(_e) => Err(_e.to_string()),
    }
}

#[tauri::command]
fn is_vault_unlocked(jexpe_vault: State<JexpeVault>) -> Result<String, String> {
    match *jexpe_vault.master_password.lock().unwrap() {
        Some(_) => Ok("Success!".to_string()),
        None => Err("Vault is not open!".to_string()),
    }
}

fn main() {
    jexpe_vault::init();

    tauri::Builder::default()
        .manage(JexpeVault::new())
        .invoke_handler(tauri::generate_handler![unlock_vault, is_vault_unlocked])
        .run(tauri::generate_context!())
        .expect("error while running jexpe application");
}
