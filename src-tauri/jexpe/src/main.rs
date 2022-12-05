use std::sync::Mutex;
use tauri::{AppHandle, Manager, State, WindowEvent};
use jexpe_vault::{Group, Host, vault};
use jexpe_vault::token::{generate_token_secret, sign_token, verify_token};
use jexpe_vault::vault::{create_group, open};

struct JexpeState {
    token_secret: Mutex<String>,
}

impl JexpeState {
    fn new() -> Self {
        Self {
            token_secret: Mutex::new(generate_token_secret()),
        }
    }
}


fn get_app_data_dir(app_handle: &AppHandle) -> String {
    let app_data_dir = app_handle.path_resolver().app_data_dir().unwrap();
    return app_data_dir.into_os_string().into_string().unwrap();
}

#[tauri::command]
fn try_master_password(
    app_handle: AppHandle,
    state: State<JexpeState>,
    master_password: String,
) -> Result<String, String> {
    let app_data_dir = get_app_data_dir(&app_handle);

    let repo_result = vault::open(&app_data_dir, "default", &master_password);
    match repo_result {
        Ok(repo) => repo,
        Err(err) => return Err(err.to_string()),
    };

    let secret = match state.token_secret.lock() {
        Ok(secret) => secret,
        Err(err) => return Err(err.to_string()),
    };

    match sign_token(secret.as_bytes(), master_password) {
        Ok(token) => Ok(token),
        Err(err) => Err(err.to_string()),
    }
}

#[tauri::command]
fn get_groups(
    app_handle: AppHandle,
    state: State<JexpeState>,
    token: String,
) -> Result<Vec<Group>, String> {
    let app_data_dir = get_app_data_dir(&app_handle);

    let secret = match state.token_secret.lock() {
        Ok(secret) => secret,
        Err(err) => return Err(err.to_string()),
    };

    let master_password = match verify_token(secret.as_bytes(), &token) {
        Ok(master_password) => master_password,
        Err(err) => return Err(err.to_string()),
    };

    let mut repo = match vault::open(&app_data_dir, "default", &master_password) {
        Ok(repo) => repo,
        Err(err) => return Err(err.to_string()),
    };

    let groups_result = vault::get_groups(&mut repo);
    match groups_result {
        Ok(groups) => Ok(groups),
        Err(err) => Err(err.to_string()),
    }
}

fn main() {
    jexpe_vault::init();

    // let mut repo = open("C:\\Users\\ricca\\AppData\\Roaming\\com.jexpe.desktop", "default", "mela").unwrap();
    //
    // create_group(&mut repo, None, String::from("VersusLand")).unwrap();
    // create_group(&mut repo, None, String::from("Jexpe")).unwrap();

    tauri::Builder::default()
        .manage(JexpeState::new())
        .invoke_handler(tauri::generate_handler![try_master_password, get_groups])
        .run(tauri::generate_context!())
        .expect("error while running jexpe application");
}
