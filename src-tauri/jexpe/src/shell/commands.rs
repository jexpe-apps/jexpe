use crate::shell::SystemShell;

#[cfg(target_os = "windows")]
#[tauri::command]
pub fn get_system_shells() -> Result<Vec<SystemShell>, String> {
    Ok(crate::shell::windows::get_available_shells())
}

#[cfg(target_os = "macos")]
#[tauri::command]
pub fn get_system_shells() -> Result<Vec<SystemShell>, String> {
    Ok(crate::shell::macos::get_available_shells())
}

#[cfg(target_os = "linux")]
#[tauri::command]
pub fn get_system_shells() -> Result<Vec<SystemShell>, String> {
    Ok(crate::shell::linux::get_available_shells())
}