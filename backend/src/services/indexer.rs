use crate::config::MediaPath;
use crate::models::media::{MediaManager, MediaType, NewMedia};
use blake2::{Blake2b, Digest};
use diesel::pg::PgConnection;
use glob::glob;
use log::{debug, error, info};
use std::convert::TryFrom;
use std::error::Error;
use std::fs::File;
use std::path::Path;
use std::{fs, io};

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
            info!(
                "Found {} new media files in {}",
                index_result.unwrap(),
                mp.path
            );
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
        if !entry.is_ok() {
            continue;
        }

        let pathbuf = &entry.unwrap();
        if !valid_media(&pathbuf) {
            continue;
        }

        let metadata = std::fs::metadata(&pathbuf)?;
        let modified = match metadata.modified() {
            Ok(time) => time,
            Err(e) => {
                debug!("Error fetching metadata for {}: {}", pathbuf.display(), e);
                continue;
            }
        };
        let modified = i32::try_from(
            modified
                .duration_since(std::time::SystemTime::UNIX_EPOCH)?
                .as_secs(),
        )
        .unwrap();

        let mut hash: String = String::from("");
        let path = pathbuf.to_str().unwrap();
        //if already present in db... check timestamp
        let new_or_modified = match MediaManager::get_media_by_path(conn, &path.to_string()) {
            Some(media) => {
                //has the file been modified?
                //TODO: remove eventual cache files if the hash has changed
                if media.modified != modified {
                    hash = fetch_hash_from_path(&pathbuf)?;
                    media.hash != hash
                } else {
                    false
                }
            }
            None => {
                hash = fetch_hash_from_path(&pathbuf)?;
                true
            }
        };

        //if changed (new hash) or new, add to db
        if new_or_modified {
            let res = MediaManager::upsert(
                conn,
                &NewMedia {
                    path: &path,
                    name: &pathbuf.file_name().unwrap().to_str().unwrap(),
                    processed: &false,
                    hash: hash.as_str(),
                    modified: &modified,
                    timestamp: &modified,
                    media_type: &(MediaType::Image as i32),
                },
            );

            if res.is_err() {
                error!("Failed to update database: {:?}", &res.err());
            } else {
                indexed_files += 1;
                info!("Added media to db: {:?}", pathbuf);

                //TODO: Extended info? exif
                //fetch_extended_info(file_path: &Path)
            }
        }
    }

    Ok(indexed_files)
}

fn valid_media(file_path: &Path) -> bool {
    let file_name = String::from(file_path.file_name().unwrap().to_str().unwrap());

    for ending in vec![".jpg", ".jpeg", ".png", ".gif", ".bmp", ".raw"] {
        if file_name.ends_with(ending) {
            return true;
        }
    }
    false
}

fn fetch_hash_from_path(file_path: &Path) -> Result<String, Box<dyn Error>> {
    let mut file = fs::File::open(&file_path)?;
    fetch_hash(&mut file)
}

fn fetch_hash(file: &mut File) -> Result<String, Box<dyn Error>> {
    let mut hasher = Blake2b::new();
    io::copy(file, &mut hasher)?;

    let hash = hasher.finalize();
    Ok(String::from(std::format!("{:x}", hash)))
}

#[allow(dead_code)]
fn fetch_extended_info(file_path: &Path) -> Result<(), Box<dyn Error>> {
    let file = fs::File::open(file_path)?;
    let mut bufreader = io::BufReader::new(&file);
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
