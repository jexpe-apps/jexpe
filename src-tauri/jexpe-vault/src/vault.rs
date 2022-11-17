use std::error::Error;
use std::io::{Read, Seek, SeekFrom};
use zbox::{OpenOptions, RepoOpener};
pub use zbox::Repo;
use crate::{Group, Host};

pub fn open(path: &str, vault: &str, master_password: String) -> Result<Repo, Box<dyn Error>> {
    let repo_dir = format!("sqlite://{}/vaults/{}.sqlite", path, vault);

    {
        // zbox not creating parent directories...
        let repo_dir = format!("{}/vaults/", path);
        let path = std::path::Path::new(&repo_dir);
        std::fs::create_dir_all(path)?;
    }

    // Create and open a repository in current OS directory
    let repo = RepoOpener::new()
        .create(true)
        .version_limit(3)
        .open(&repo_dir, &master_password)?;

    // We should destroy the password as soon as possible after calling this method.
    drop(master_password);

    Ok(repo)
}

pub fn save_groups(repo: &mut Repo, groups: &[Group]) -> Result<(), Box<dyn Error>> {
    let mut file = OpenOptions::new()
        .create(true)
        .truncate(true)
        .open(repo, "/groups.json")?;


    let content = serde_json::to_string(groups)?;
    file.write_once(content.as_bytes())?;

    Ok(())
}

pub fn get_groups(repo: &mut Repo) -> Result<Vec<Group>, Box<dyn Error>> {

    // Create and open a file in repository for writing
    let mut file = OpenOptions::new()
        .read(true)
        .create(true)
        .open(repo, "/groups.json")?;

    let mut content = String::new();
    file.seek(SeekFrom::Start(0))?;
    file.read_to_string(&mut content)?;

    let entities: Vec<Group> = if content.is_empty() { vec![] } else { serde_json::from_str(&content)? };
    Ok(entities)
}

pub fn update_group(repo: &mut Repo, id: String, parent: Option<String>, display_name: String) -> Result<Vec<Group>, Box<dyn Error>> {
    let mut groups = get_groups(repo)?;

    let index = groups.iter().position(|group| group.id == id);
    if index.is_some() {
        groups[index.unwrap()] = Group {
            id,
            parent,
            display_name,
        };

        save_groups(repo, &groups)?;
    }

    Ok(groups)
}

pub fn create_group(repo: &mut Repo, parent: Option<String>, display_name: String) -> Result<Vec<Group>, Box<dyn Error>> {
    let mut groups = get_groups(repo)?;

    groups.push(Group {
        id: cuid::cuid()?,
        parent,
        display_name,
    });

    save_groups(repo, &groups)?;

    Ok(groups)
}

pub fn delete_group(repo: &mut Repo, id: String) -> Result<Vec<Group>, Box<dyn Error>> {
    let mut groups = get_groups(repo)?;

    let index = groups.iter().position(|group| group.id == id);
    if index.is_some() {
        groups.swap_remove(index.unwrap());
        save_groups(repo, &groups)?;
    }

    Ok(groups)
}

pub fn get_hosts(repo: &mut Repo) -> Result<Vec<Host>, Box<dyn Error>> {

    // Create and open a file in repository for writing
    let mut file = OpenOptions::new()
        .create(true)
        .open(repo, "/hosts.json")?;

    let mut content = String::new();
    file.seek(SeekFrom::Start(0))?;
    file.read_to_string(&mut content)?;

    let entities: Vec<Host> = if content.is_empty() { vec![] } else { serde_json::from_str(&content)? };
    Ok(entities)
}