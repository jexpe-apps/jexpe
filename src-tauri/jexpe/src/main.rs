use std::borrow::{Borrow, BorrowMut};
use std::error::Error;
use tauri::Manager;
use jexpe_vault::{Group, Host, vault};

mod errors;

struct JexpeVault {
    repo: Option<vault::Repo>,
}

#[tauri::command]
pub fn open_vault(
    app_handle: tauri::AppHandle,
    jexpe_vault: tauri::State<JexpeVault>,
    master_password: String,
) -> Result<String, String> {

    let app_data_dir = app_handle.path_resolver().app_data_dir()
        .unwrap_or_else(Err(errors::APP_DATA_DIR_INVALID));



    vault::open()
}

fn main() {
    jexpe_vault::init();

    tauri::Builder::default()
        .manage(JexpeVault { repo: None })
        .run(tauri::generate_context!())
        .expect("error while running jexpe application");
}
