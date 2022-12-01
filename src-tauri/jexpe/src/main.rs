use std::sync::Mutex;
use tauri::{AppHandle, Manager, State, WindowEvent};
use jexpe_vault::{Group, Host, vault};
use vault::Repo;

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
            Err(_e.to_string())
        }
    }
}

fn main() {
    jexpe_vault::init();

    let mut app = tauri::Builder::default()
        .manage(JexpeVault { repo: Mutex::new(None) })
        .on_window_event(|event| {
            match event.event() {
                WindowEvent::CloseRequested { .. } => {
                    let jexpe_vault: State<JexpeVault> = event.window().state();
                    let repo = jexpe_vault.repo.lock().unwrap();
                    match repo {
                        Some(repo) => {
                            drop(repo);
                        }
                        None => {}
                    }

                }
                _ => {}
            }
        })
        .invoke_handler(tauri::generate_handler![open_vault])
        .run(tauri::generate_context!())
        .expect("error while running jexpe application");
}
