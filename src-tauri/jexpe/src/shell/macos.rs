use phf::phf_map;

use super::SystemShell;
use std::{fs::File, io::{BufReader, BufRead}, collections::HashMap};

const ICON_MAPPINGS: phf::Map<&'static str, &'static str> = phf_map! {
    "bash" => "/assets/icons/bash.svg",
};

pub fn get_available_shells() -> Vec<SystemShell> {
    let mut shells = Vec::new();

    let file = File::open("/etc/shells");
    if let Ok(file) = file {
        for path in BufReader::new(file)
            .lines()
            .filter_map(|line| line.ok())
            .map(|line| line.split("#").next())
            .filter_map(|shell| shell.map(str::trim)) {

            if let Some(name) = path.splt("/").last() {

                shells.push(SystemShell {
                    id: name.to_string(),
                    name: name.to_string(),
                    command: path.to_string(),
                    args: Vec::new(),
                    env: HashMap::new(),
                    cwd: None,
                    icon: ICON_MAPPINGS.get(name.clone().as_ref()).cloned()
                        .unwrap_or("/assets/icons/bash.svg").to_string(),
                });

            }

        }
    }

    shells
}