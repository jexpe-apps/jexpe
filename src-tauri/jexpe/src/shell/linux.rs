#[tauri::command]
pub fn get_system_shells() -> Result<Vec<SystemShell>, String> {
    let mut shells: Vec<SystemShell> = Vec::new();

    Ok(shells)
}