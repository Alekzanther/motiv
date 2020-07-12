extern crate glob;
use glob::glob;

pub fn get_media(path: &str) -> glob::Paths {
    let mut search_path = path.to_owned();
    if !path.ends_with('/') {
        search_path = search_path + "/";
    }
    return glob(&(search_path + "**/*.*")).unwrap();
}

pub fn index_media(path: &str) {
    for entry in get_media(path) {
        match entry {
            Ok(path) => println!("{:?}", path.display()),
            Err(error) => println!("{:?}", error),
        }
    }
}
