use phf::phf_map;

use super::SystemShell;
use std::{fs::File, io::{BufReader, BufRead}, collections::HashMap};

const ICON_MAPPINGS: phf::Map<&'static str, &'static str> = phf_map! {
    "bash" => "/assets/icons/bash.svg",
};

pub fn get_available_shells() -> Vec<SystemShell> {
    let mut shells = Vec::new();

    let file = File::open("/etc/shells");
    let reader = BufReader::new(file.unwrap());

    for line in reader.lines().into_iter()
    .filter_map(|x| x.ok())
    .filter_map(|x| if x.starts_with("#") { None } else { Some(x) }) {
        let splitted_line: Vec<String> = line.split("#").map(|s| s.to_string()).collect();
        let shell_path = splitted_line[0].trim();
        let splitted_path: Vec<String> = shell_path.split("/").map(|s| s.to_string()).collect();
        let shell_name = &splitted_path[splitted_path.len() - 1];
        if shell_path.len() > 0 {
            shells.push(SystemShell { 
                id: shell_name.to_string(), 
                name: shell_name.to_string(), 
                command: shell_path.to_string(), 
                args: Vec::new(), 
                env: HashMap::new(), 
                cwd: None, 
                icon: ICON_MAPPINGS.get(shell_name.clone().as_ref()).cloned()
                .unwrap_or("/assets/icons/bash.svg").to_string() 
            });
        }
    }


    // TODO default shell: /usr/bin/dscl . -read /Users/${LOGNAME} UserShell`



    shells
}