use tauri::{AppHandle, Manager, State, WindowEvent};
use jexpe_vault::Vault;
use serde::{Deserialize, Serialize};


fn get_app_data_dir(app_handle: &AppHandle) -> String {
    let app_data_dir = app_handle.path_resolver().app_data_dir().unwrap();
    return app_data_dir.into_os_string().into_string().unwrap();
}

// #[tauri::command]
// fn try_master_password(
//     app_handle: AppHandle,
//     master_password: String,
// ) -> Result<String, String> {
//     let app_data_dir = get_app_data_dir(&app_handle);
//
//     jexpe_vault::try_master_password(&app_data_dir, master_password)
//         .map_err(|e| e.to_string())
// }
//
// #[tauri::command]
// fn get_vault(app_handle: AppHandle, token: String) -> Result<Vault, String> {
//     let app_data_dir = get_app_data_dir(&app_handle);
//
//     jexpe_vault::get_vault(&app_data_dir, &token)
//         .map_err(|e| e.to_string())
// }


#[derive(Serialize, Deserialize, Debug)]
struct OSShell {
    display_name: String,
    icon: String,
    command: String,
}

#[tauri::command]
fn get_os_shells(
    app_handle: AppHandle,
) -> Vec<OSShell> {
    let mut shells = Vec::new();

    if cfg!(target_os = "windows") {
        shells.push(OSShell {
            display_name: "Windows PowerShell".to_string(),
            icon: "https://img.icons8.com/color/48/null/powershell.png".to_string(),
            command: "C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe".to_string(),
        });
        shells.push(OSShell {
            display_name: "Command Prompt".to_string(),
            icon: "https://img.icons8.com/fluency/48/null/console.png".to_string(),
            command: "C:\\Windows\\System32\\cmd.exe".to_string(),
        });
        shells.push(OSShell {
            display_name: "Git Bash".to_string(),
            icon: "https://img.icons8.com/color/48/null/git.png".to_string(),
            command: "C:\\Program Files\\Git\\bin\\bash.exe".to_string(),
        });
        shells.push(OSShell {
            display_name: "WSL".to_string(),
            icon: "https://img.icons8.com/color/48/null/linux.png".to_string(),
            command: "C:\\Windows\\System32\\wsl.exe".to_string(),
        });
    }

    shells
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
        .invoke_handler(tauri::generate_handler![get_os_shells])
        .run(tauri::generate_context!())
        .expect("error while running jexpe application");
}
