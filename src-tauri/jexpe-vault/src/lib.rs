use serde::{Serialize, Deserialize};
use zbox::init_env;

pub mod vault;

#[derive(Serialize, Deserialize, Debug)]
pub struct HostService {
    pub id: String,
    pub port: u16,
    pub username: String,
    pub password: String,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct Host {
    pub id: String,
    pub parent: Option<String>,
    pub display_name: String,
    pub hostname: String,
    pub services: Vec<HostService>,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct Group {
    pub id: String,
    pub parent: Option<String>,
    pub display_name: String,
}

pub fn init() {
    init_env();
}
