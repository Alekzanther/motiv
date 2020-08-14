use crate::config::MediaPath;
use crate::models::media::{MediaManager, NewMedia};
use diesel::pg::PgConnection;
use glob::glob;
use log::{debug, error, info};
use std::error::Error;
use std::path::Path;

pub fn index_media(conn: &PgConnection, paths: Vec<MediaPath>) {
    for mp in paths {
        let index_result = index_media_path(conn, &mp.path);
        if index_result.is_err() {
            error!(
                "Failed to read '{0}': {1}",
                mp.path,
                &index_result.unwrap_err()
            );
        } else {
            info!("Found {} valid files in {}", index_result.unwrap(), mp.path);
        }
    }
}

fn index_media_path(conn: &PgConnection, path: &String) -> Result<u32, Box<dyn Error>> {
    let mut glob_path = path.clone();

    if !glob_path.ends_with("/") {
        glob_path = glob_path + "/";
    }
    glob_path += "**/*.*";

    info!("Searching through {}", glob_path);
    let mut indexed_files = 0u32;
    for entry in glob(&glob_path)? {
        if entry.is_ok() {
            let pathbuf = &entry.unwrap();
            let file_info = fetch_metadata(&pathbuf);
            if file_info.is_ok() {
                let res = MediaManager::upsert(
                    conn,
                    &NewMedia {
                        path: &pathbuf.to_str().unwrap(),
                        name: &pathbuf.file_name().unwrap().to_str().unwrap(),
                    },
                );
                if res.is_err() {
                    error!("Failed to update database: {:?}", &res.err());
                } else {
                    indexed_files += 1;
                    info!("Added media to db: {:?}", pathbuf);
                }
            } else {
                debug!(
                    "Error fetching metadata for {}: {}",
                    pathbuf.display(),
                    file_info.unwrap_err()
                );
            }
        }
    }

    Ok(indexed_files)
}

fn fetch_metadata(file_path: &Path) -> Result<(), Box<dyn Error>> {
    let file = std::fs::File::open(file_path)?;
    let mut bufreader = std::io::BufReader::new(&file);
    let exifreader = exif::Reader::new();
    let exif = exifreader.read_from_container(&mut bufreader)?;

    debug!("Reading metadata for {} :: ", &file_path.display());
    if let Ok(metadata) = file.metadata() {
        debug!("file_type :: {:?}", &metadata.file_type());
        debug!("size :: {:?} KB", &metadata.len() / 1024);
        debug!("modified :: {:?}", &metadata.modified());
    }

    for f in exif.fields() {
        debug!(
            "exif:: {} {} {}",
            f.tag,
            f.ifd_num,
            f.display_value().with_unit(&exif)
        );
    }
    Ok(())
}
