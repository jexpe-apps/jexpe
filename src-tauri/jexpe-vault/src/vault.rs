use std::borrow::BorrowMut;
use crate::{Group, Host, jwt, Vault};
use std::error::Error;
use std::io::{Read, Seek, SeekFrom};
use zbox::{Repo, OpenOptions, RepoOpener};

fn save_groups(repo: &mut Repo, groups: &[Group]) -> Result<(), Box<dyn Error>> {
    let mut file = OpenOptions::new()
        .create(true)
        .truncate(true)
        .open(repo, "/groups.json")?;

    let content = serde_json::to_string(groups)?;
    file.write_once(content.as_bytes())?;

    Ok(())
}

pub(crate) fn get_groups(repo: &mut Repo) -> Result<Vec<Group>, Box<dyn Error>> {
    // Create and open a file in repository for writing
    let mut file = OpenOptions::new()
        .read(true)
        .create(true)
        .open(repo, "/groups.json")?;

    let mut content = String::new();
    file.seek(SeekFrom::Start(0))?;
    file.read_to_string(&mut content)?;

    let entities: Vec<Group> = if content.is_empty() {
        vec![]
    } else {
        serde_json::from_str(&content)?
    };
    Ok(entities)
}

fn update_group(
    repo: &mut Repo,
    id: String,
    parent: Option<String>,
    display_name: String,
) -> Result<Vec<Group>, Box<dyn Error>> {
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

pub(crate) fn create_group(
    repo: &mut Repo,
    parent: Option<String>,
    display_name: String,
) -> Result<Vec<Group>, Box<dyn Error>> {
    let mut groups = get_groups(repo)?;

    groups.push(Group {
        id: cuid::cuid()?,
        parent,
        display_name,
    });

    save_groups(repo, &groups)?;

    Ok(groups)
}

fn delete_group(repo: &mut Repo, id: String) -> Result<Vec<Group>, Box<dyn Error>> {
    let mut groups = get_groups(repo)?;

    let index = groups.iter().position(|group| group.id == id);
    if index.is_some() {
        groups.swap_remove(index.unwrap());
        save_groups(repo, &groups)?;
    }

    Ok(groups)
}

pub(crate) fn get_hosts(repo: &mut Repo) -> Result<Vec<Host>, Box<dyn Error>> {
    // Create and open a file in repository for writing
    let mut file = OpenOptions::new().create(true).open(repo, "/hosts.json")?;

    let mut content = String::new();
    file.seek(SeekFrom::Start(0))?;
    file.read_to_string(&mut content)?;

    let entities: Vec<Host> = if content.is_empty() {
        vec![]
    } else {
        serde_json::from_str(&content)?
    };
    Ok(entities)
}
