use crate::config::MediaPath;

pub fn index_media(paths: Vec<MediaPath>) {
    for mp in paths {
        index_media_path(&mp.path);
    }
}

fn index_media_path(path: &String) {
    println!("Searching through {}", path);
}
