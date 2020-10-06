use super::thumbnailer::generate_thumbnails;
use crate::config::MediaPath;
use crate::models::media::{MediaManager, NewMedia};
use blake2::{Blake2b, Digest};
use diesel::pg::PgConnection;
use glob::glob;
use log::{debug, error, info};
use std::error::Error;
use std::fs::{File, Metadata};
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

        let file_info = fetch_metadata(&pathbuf);
        if !file_info.is_ok() {
            debug!(
                "Error fetching metadata for {}: {}",
                pathbuf.display(),
                file_info.unwrap_err()
            );
            continue;
        }

        let mut file = fs::File::open(&pathbuf)?;
        let hash = fetch_hash(&mut file)?;
        let path = pathbuf.to_str().unwrap();
        //if already present in db... check hash
        let update_db = match MediaManager::get_media_by_path(conn, &path.to_string()) {
            Some(media) => media.hash != hash,
            None => true,
        };

        //if changed (new hash) or new, add to db
        if update_db {
            let res = MediaManager::upsert(
                conn,
                &NewMedia {
                    path: &path,
                    name: &pathbuf.file_name().unwrap().to_str().unwrap(),
                    processed: &false,
                    hash: hash.as_str(),
                },
            );

            if res.is_err() {
                error!("Failed to update database: {:?}", &res.err());
            } else {
                indexed_files += 1;
                info!("Added media to db: {:?}", pathbuf);
                //TODO:  Move thumbnail generation into its own separate thread
                //let thumbres = generate_thumbnails(
                //    &path,
                //    res.unwrap().id.to_string().as_str(),
                //    ".thumbs",
                //);
                //if thumbres.is_err() {
                //    error!(
                //        "Couldn't generate thumb for {}: {:?}",
                //        path, thumbres
                //    );
                //}

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

fn fetch_metadata(file_path: &Path) -> Result<Metadata, std::io::Error> {
    let file = fs::File::open(file_path)?;
    file.metadata()
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
