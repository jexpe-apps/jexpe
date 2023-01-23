use crate::shell::SystemShell;

#[tauri::command]
pub fn get_system_shells() -> Result<Vec<SystemShell>, String> {

    
    #[cfg(target_os = "windows")]
    return Ok(crate::shell::windows::get_available_shells());
    
    #[cfg(target_os = "macos")]
    return Ok(crate::shell::macos::get_available_shells());

    Ok(Vec::new())
}