use crate::shell::SystemShell;

#[tauri::command]
pub fn get_system_shells() -> Result<Vec<SystemShell>, String> {
    let mut shells = Vec::new();

    if cfg!(target_os = "windows") {
        shells.push(SystemShell {
            display_name: "Command Prompt".to_string(),
            icon: "https://raw.githubusercontent.com/microsoft/terminal/main/src/cascadia/CascadiaPackage/ProfileIcons/%7B0caa0dad-35be-5f56-a8ff-afceeeaa6101%7D.scale-200.png".to_string(),
            command: "cmd.exe".to_string(),
            directory: "%USERPROFILE%".to_string(),
        });

        shells.push(SystemShell {
            display_name: "Windows PowerShell".to_string(),
            icon: "https://raw.githubusercontent.com/microsoft/terminal/main/src/cascadia/CascadiaPackage/ProfileIcons/%7B61c54bbd-c2c6-5271-96e7-009a87ff44bf%7D.scale-200.png".to_string(),
            command: "powershell.exe".to_string(),
            directory: "%USERPROFILE%".to_string(),
        });

        shells.push(SystemShell {
            display_name: "Git Bash".to_string(),
            icon: "https://git-scm.com/images/logos/downloads/Git-Icon-1788C.png".to_string(),
            command: "bash.exe -l -i".to_string(),
            directory: "%USERPROFILE%".to_string(),
        });

        shells.push(SystemShell {
            display_name: "Ubuntu".to_string(),
            icon: "https://assets.ubuntu.com/v1/49a1a858-favicon-32x32.png".to_string(),
            command: "wsl.exe -d Ubuntu".to_string(),
            directory: "~".to_string(),
        });
    }

    if cfg!(target_os = "macos") {
        shells.push(SystemShell {
            display_name: "zsh".to_string(),
            icon: "https://assets.ubuntu.com/v1/49a1a858-favicon-32x32.png".to_string(),
            command: "zsh".to_string(),
            directory: "~".to_string(),
        });
        shells.push(SystemShell {
            display_name: "Bash".to_string(),
            icon: "https://assets.ubuntu.com/v1/49a1a858-favicon-32x32.png".to_string(),
            command: "bash".to_string(),
            directory: "~".to_string(),
        });
        shells.push(SystemShell {
            display_name: "SH".to_string(),
            icon: "https://assets.ubuntu.com/v1/49a1a858-favicon-32x32.png".to_string(),
            command: "sh".to_string(),
            directory: "~".to_string(),
        });
    }

    if cfg!(target_os = "linux") {
        shells.push(SystemShell {
            display_name: "Bash".to_string(),
            icon: "https://assets.ubuntu.com/v1/49a1a858-favicon-32x32.png".to_string(),
            command: "bash".to_string(),
            directory: "~".to_string(),
        });
        shells.push(SystemShell {
            display_name: "SH".to_string(),
            icon: "https://assets.ubuntu.com/v1/49a1a858-favicon-32x32.png".to_string(),
            command: "sh".to_string(),
            directory: "~".to_string(),
        });
    }

    // TODO: Add support for other systems

    Ok(shells)
}