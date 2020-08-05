use crate::config::MediaPath;
use glob::glob;
use log::{debug, error, info};
use std::error::Error;
use std::path::Path;

pub fn index_media(paths: Vec<MediaPath>) {
    for mp in paths {
        let index_result = index_media_path(&mp.path);
        if index_result.is_err() {
            error!(
                "Failed to read '{0}': {1}",
                &mp.path,
                &index_result.unwrap_err()
            );
        } else {
            info!(
                "Found {} valid files in {}",
                index_result.unwrap(),
                &mp.path
            );
        }
    }
}

fn index_media_path(path: &String) -> Result<u32, Box<dyn Error>> {
    let mut glob_path = path.clone();

    if !glob_path.ends_with("/") {
        glob_path = glob_path + "/";
    }
    glob_path += "**/*.*";

    info!("Searching through {}", glob_path);
    let mut indexed_files = 0u32;
    for entry in glob(&glob_path)? {
        if entry.is_ok() {
            let file_info = fetch_metadata(&entry.unwrap());
            if file_info.is_ok() {
                indexed_files += 1;
            }
        }
    }

    Ok(indexed_files)
}

fn fetch_metadata(file_path: &Path) -> Result<(), Box<dyn Error>> {
    debug!("Reading metadata for {}", &file_path.display());
    Ok(())
}
