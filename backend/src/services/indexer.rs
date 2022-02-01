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
            let results = index_result.unwrap_or(0);
            if results > 0 {
                info!("Found {} new media files in {}", results, mp.path);
            } else {
                debug!("Found {} new media files in {}", results, mp.path);
            }
        }
    }
}

fn index_media_path(conn: &PgConnection, path: &str) -> Result<u32, Box<dyn Error>> {
    let mut glob_path = path.to_owned();

    if !glob_path.ends_with('/') {
        glob_path += "/";
    }
    glob_path += "**/*.*";

    debug!("Searching through {}", glob_path);
    let mut indexed_files = 0u32;
    for entry in glob(&glob_path)? {
        if entry.is_err() {
            continue;
        }

        let pathbuf = &entry.unwrap();
        let media_type = get_media_type(pathbuf);
        if let MediaType::Unknown = media_type {
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
        let new_or_modified =
            match MediaManager::get_media_by_path(conn, &path.to_string()) {
                Some(media) => {
                    //has the file been modified?
                    //TODO: remove eventual cache files if the hash has changed
                    if media.modified != modified {
                        hash = fetch_hash_from_path(pathbuf)?;
                        media.hash != hash
                    } else {
                        false
                    }
                }
                None => {
                    hash = fetch_hash_from_path(pathbuf)?;
                    true
                }
            };

        //if changed (new hash) or new, add to db
        if new_or_modified {
            let res = MediaManager::upsert(
                conn,
                &NewMedia {
                    path,
                    name: pathbuf.file_name().unwrap().to_str().unwrap(),
                    processed: &false,
                    hash: hash.as_str(),
                    modified: &modified,
                    timestamp: &modified,
                    media_type: &(media_type as i32),
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

fn get_media_type(file_path: &Path) -> MediaType {
    let file_name = String::from(file_path.file_name().unwrap().to_str().unwrap());
    if [".jpg", ".jpeg", ".png", ".bmp", ".raw"]
        .iter()
        .any(|ending| file_name.ends_with(ending))
    {
        return MediaType::Image;
    }

    if [".mts", ".mp4", ".avi", ".mkv"]
        .iter()
        .any(|ending| file_name.ends_with(ending))
    {
        return MediaType::Video;
    }

    if file_name.ends_with(".gif") {
        return MediaType::Gif;
    }

    MediaType::Unknown
}

fn fetch_hash_from_path(file_path: &Path) -> Result<String, Box<dyn Error>> {
    let mut file = fs::File::open(&file_path)?;
    fetch_hash(&mut file)
}

fn fetch_hash(file: &mut File) -> Result<String, Box<dyn Error>> {
    let mut hasher = Blake2b::new();
    io::copy(file, &mut hasher)?;

    let hash = hasher.finalize();
    Ok(std::format!("{:x}", hash))
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

#[test]
fn file_endings_return_correct_media_type() {
    assert_eq!(
        MediaType::Image as i32,
        get_media_type(Path::new(".png")) as i32
    );
    assert_eq!(
        MediaType::Image as i32,
        get_media_type(Path::new(".jpg")) as i32
    );
    assert_eq!(
        MediaType::Image as i32,
        get_media_type(Path::new(".bmp")) as i32
    );
    //    assert_eq!(MediaType::Gif, get_media_type(Path::new(".gif")) as i32);
    assert_eq!(
        MediaType::Video as i32,
        get_media_type(Path::new(".mp4")) as i32
    );
    assert_eq!(
        MediaType::Video as i32,
        get_media_type(Path::new(".mkv")) as i32
    );
    assert_eq!(
        MediaType::Video as i32,
        get_media_type(Path::new(".avi")) as i32
    );
    assert_eq!(
        MediaType::Gif as i32,
        get_media_type(Path::new(".gif")) as i32
    );
}
