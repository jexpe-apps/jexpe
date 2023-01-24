use crate::shell::SystemShell;

#[cfg(target_family = "windows")]
#[tauri::command]
pub fn get_system_shells() -> Result<Vec<SystemShell>, String> {
    Ok(crate::shell::windows::get_available_shells())
}

#[cfg(target_family = "unix")]
#[tauri::command]
pub fn get_system_shells() -> Result<Vec<SystemShell>, String> {
    Ok(crate::shell::unix::get_available_shells())
}