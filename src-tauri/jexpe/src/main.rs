use tauri::{AppHandle, Manager, State, WindowEvent};
use jexpe_vault::Vault;

fn get_app_data_dir(app_handle: &AppHandle) -> String {
    let app_data_dir = app_handle.path_resolver().app_data_dir().unwrap();
    return app_data_dir.into_os_string().into_string().unwrap();
}

#[tauri::command]
fn try_master_password(
    app_handle: AppHandle,
    master_password: String,
) -> Result<String, String> {
    let app_data_dir = get_app_data_dir(&app_handle);

    jexpe_vault::try_master_password(&app_data_dir, master_password)
        .map_err(|e| e.to_string())
}

#[tauri::command]
fn get_vault(app_handle: AppHandle, token: String) -> Result<Vault, String> {
    let app_data_dir = get_app_data_dir(&app_handle);

    jexpe_vault::get_vault(&app_data_dir, &token)
        .map_err(|e| e.to_string())
}

fn main() {
    jexpe_vault::init();

    // let path = "C:\\Users\\ricca\\AppData\\Roaming\\com.jexpe.desktop";
    //
    // let token = jexpe_vault::try_master_password(path, "mela".to_string()).unwrap();
    // let vault = jexpe_vault::get_vault(path, &token).unwrap();
    //
    // println!("{:?}", vault);

    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![try_master_password, get_vault])
        .run(tauri::generate_context!())
        .expect("error while running jexpe application");
}
