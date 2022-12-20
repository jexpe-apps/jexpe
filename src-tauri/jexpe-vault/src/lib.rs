use std::borrow::BorrowMut;
use std::error::Error;
use chrono::Utc;
use lazy_static::lazy_static;
use rand::{distributions, Rng};
use serde::{Deserialize, Serialize};
use zbox::{init_env, RepoOpener};
use crate::vault::{get_groups, get_hosts};

mod vault;
mod jwt;

lazy_static! {
    static ref JWT_SECRET: String = rand::thread_rng()
        .sample_iter(&distributions::Alphanumeric)
        .take(32)
        .map(char::from)
        .collect();
}

// ======== JWT ========

#[derive(Serialize, Deserialize, Debug)]
struct Claims {
    master_password: String,
    exp: usize,
    iat: usize,
}

impl Claims {
    fn new(master_password: String) -> Self {
        let now = Utc::now().timestamp() as usize;
        println!("now: {}", now);
        Self {
            master_password,
            exp: now + 60, // 5 minutes
            iat: now,
        }
    }
}

// ======== VAULT ========

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

#[derive(Serialize, Deserialize, Debug)]
pub struct Vault {
    pub id: String,
    pub display_name: String,
    pub description: Option<String>,
    pub groups: Vec<Group>,
    pub hosts: Vec<Host>,
}

pub fn init() {
    init_env();
}

pub fn try_master_password(path: &str, master_password: String) -> Result<String, Box<dyn Error>> {
    let repo_dir = format!("file://{}/vaults/default.vlt", path);

    {
        // zbox not creating parent directories...
        let repo_dir = format!("{}/vaults/", path);
        let path = std::path::Path::new(&repo_dir);
        std::fs::create_dir_all(path)?;
    }

    // Create and open a repository
    RepoOpener::new()
        .create(true)
        .version_limit(3)
        .open(&repo_dir, &master_password)?;

    // We should destroy the password as soon as possible after calling this method.
    //drop(master_password);

    jwt::sign_token(master_password)
}

pub fn get_vault(path: &str, token: &str) -> Result<Vault, Box<dyn Error>> {
    let master_password = jwt::verify_token(token)?;
    let repo_dir = format!("file://{}/vaults/default.vlt", path);

    // Create and open a repository
    let mut repo = RepoOpener::new()
        .version_limit(3)
        .open(&repo_dir, &master_password)?;

    // We should destroy the password as soon as possible after calling this method.
    drop(master_password);

    let vault = Vault {
        id: "clbc4d7lq000008mjf24n6xzg".to_string(), // Random generated ID
        display_name: "Default".to_string(),
        description: Some("Your default vault for storing items.".to_string()),
        groups: get_groups(repo.borrow_mut())?,
        hosts: get_hosts(repo.borrow_mut())?,
    };

    Ok(vault)
}
