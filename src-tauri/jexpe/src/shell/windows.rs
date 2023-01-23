use std::collections::HashMap;
use std::{env, fs};
use std::path::Path;
use std::string::ToString;
use winreg::enums::{HKEY_CURRENT_USER, HKEY_LOCAL_MACHINE};
use winreg::RegKey;
use crate::shell::SystemShell;
use phf::{phf_map};

const WSL_ICON_MAPPINGS: phf::Map<&'static str, &'static str> = phf_map! {
    "Alpine" => "/assets/icons/alpine.svg",
    "Debian" => "/assets/icons/debian.svg",
    "kali-linux" => "/assets/icons/kali.svg",
    "SLES-12" => "/assets/icons/suse.svg",
    "openSUSE-Leap-15-1" => "/assets/icons/suse.svg",
    "Ubuntu-16.04" => "/assets/icons/ubuntu.svg",
    "Ubuntu-18.04" => "/assets/icons/ubuntu.svg",
    "Ubuntu-22.04" => "/assets/icons/ubuntu.svg",
    "Ubuntu" => "/assets/icons/ubuntu.svg",
    "AlmaLinux-8" => "/assets/icons/alma.svg",
    "OracleLinux_7_9" => "/assets/icons/oracle-linux.svg",
    "OracleLinux_8_5" => "/assets/icons/oracle-linux.svg",
    "openEuler" => "/assets/icons/open-euler.svg",
    "Linux" => "/assets/icons/linux.svg",
    "docker-desktop" => "/assets/icons/docker.svg",
    "docker-desktop-data" => "/assets/icons/docker.svg",
};

pub fn get_available_shells() -> Vec<SystemShell> {
    let mut shells = Vec::new();

    shells = get_stock(shells);
    shells = get_gitbash(shells);
    shells = get_powershell_core(shells);
    shells = get_vscode(shells);
    shells = get_wsl(shells);

    shells
}

fn get_stock(mut shells: Vec<SystemShell>) -> Vec<SystemShell> {

    // TODO: Maybe bundle https://mridgers.github.io/clink/ (?)

    shells.push(SystemShell {
        id: "cmd".to_string(),
        name: "CMD (Stock)".to_string(),
        command: "cmd.exe".to_string(),
        args: Vec::new(),
        env: HashMap::new(),
        cwd: None,
        icon: "/assets/icons/cmd.svg".to_string(),
    });

    shells.push(SystemShell {
        id: "powershell".to_string(),
        name: "PowerShell".to_string(),
        command: "powershell.exe".to_string(),
        args: Vec::from(["-NoLogo".to_string()]),
        env: HashMap::from([
            ("TERM".to_string(), "cygwin".to_string())
        ]),
        cwd: None,
        icon: "/assets/icons/powershell.svg".to_string(),
    });

    shells
}

fn get_gitbash(mut shells: Vec<SystemShell>) -> Vec<SystemShell> {
    let mut gitbash_path: Option<String> = None;

    {
        match RegKey::predef(HKEY_LOCAL_MACHINE).open_subkey("Software\\GitForWindows") {
            Ok(regkey) => {
                match regkey.get_value("InstallPath") {
                    Ok(path) => gitbash_path = Some(path),
                    Err(_e) => {}
                };
            }
            Err(_) => {}
        }
    }

    {
        match RegKey::predef(HKEY_CURRENT_USER).open_subkey("Software\\GitForWindows") {
            Ok(regkey) => {
                match regkey.get_value("InstallPath") {
                    Ok(path) => gitbash_path = Some(path),
                    Err(_e) => {}
                };
            }
            Err(_) => {}
        }
    }

    if let Some(gitbash_path) = gitbash_path {
        shells.push(SystemShell {
            id: "git=bash".to_string(),
            name: "Git Bash".to_string(),
            command: format!("{}\\bin\\bash.exe", gitbash_path),
            args: Vec::from(["--login".to_string(), "-i".to_string()]),
            env: HashMap::from([
                ("TERM".to_string(), "cygwin".to_string())
            ]),
            cwd: None,
            icon: "/assets/icons/git-bash.svg".to_string(),
        });
    };

    shells
}

fn get_powershell_core(mut shells: Vec<SystemShell>) -> Vec<SystemShell> {
    match RegKey::predef(HKEY_LOCAL_MACHINE)
        .open_subkey("Software\\Microsoft\\Windows\\CurrentVersion\\App Paths\\pwsh.exe") {
        Ok(regkey) => {
            match regkey.get_value("".to_string()) {
                Ok(path) => {
                    shells.push(SystemShell {
                        id: "powershell-core".to_string(),
                        name: "PowerShell Core".to_string(),
                        command: path,
                        args: Vec::from(["-NoLogo".to_string()]),
                        env: HashMap::from([
                            ("TERM".to_string(), "cygwin".to_string())
                        ]),
                        cwd: None,
                        icon: "/assets/icons/powershell-core.svg".to_string(),
                    });
                }
                Err(_) => {}
            }
        }
        Err(_) => {}
    };

    shells
}

fn get_vscode(mut shells: Vec<SystemShell>) -> Vec<SystemShell> {
    match env::var("ProgramFiles") {
        Ok(program_files) => {
            let path = Path::new(&program_files).join("Microsoft Visual Studio").display().to_string();
            match fs::read_dir(path) {
                Ok(versions) => {
                    for path in versions
                        .filter_map(|x| x.ok())
                        .map(|x| x.path()) {
                        let version = path.file_name().unwrap().to_str().unwrap();
                        let bat = path.join("Community\\Common7\\Tools\\VsDevCmd.bat").display().to_string();

                        shells.push(SystemShell {
                            id: format!("vs-cmd-{}", version),
                            name: format!("Developer Prompt for VS {}", version),
                            command: "cmd.exe".to_string(),
                            args: Vec::from(["/k".to_string(), bat]),
                            env: HashMap::new(),
                            cwd: None,
                            icon: format!("/assets/icons/vs{}.svg", version),
                        })
                    }
                }
                _ => {}
            };
        }
        Err(_) => {}
    }

    shells
}

fn get_wsl(mut shells: Vec<SystemShell>) -> Vec<SystemShell> {
    let lxss_path = "Software\\Microsoft\\Windows\\CurrentVersion\\Lxss";

    for key in RegKey::predef(HKEY_CURRENT_USER)
        .open_subkey(lxss_path).unwrap()
        .enum_keys()
        .map(|x| x.unwrap())
    {
        let distribution_name: String = RegKey::predef(HKEY_CURRENT_USER)
            .open_subkey(format!("{}\\{}", lxss_path, key)).unwrap()
            .get_value("DistributionName").unwrap();

        shells.push(SystemShell {
            id: format!("wsl-{}", distribution_name.clone()),
            name: format!("WSL / {}", distribution_name.clone()),
            command: "wsl.exe".to_string(),
            args: Vec::from(["-d".to_string(), distribution_name.clone()]),
            env: HashMap::from([
                ("TERM".to_string(), "xterm-256color".to_string()),
                ("COLORTERM".to_string(), "truecolor".to_string()),
            ]),
            cwd: None,
            icon: WSL_ICON_MAPPINGS.get(distribution_name.clone().as_ref()).cloned()
                .unwrap_or("/assets/icons/linux.svg").to_string(),
        })
    }

    shells
}