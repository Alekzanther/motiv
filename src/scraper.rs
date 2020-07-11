extern crate glob;
use glob::glob;

pub fn index_media(path: &str) {
    let mut search_path = path.to_owned();
    if !path.ends_with('/') {
        search_path = search_path + "/";
    }
    //iterate path
    for entry in glob(&(search_path + "**/*.*")).unwrap() {
        match entry {
            Ok(path) => println!("{:?}", path.display()),
            Err(error) => println!("{:?}", error),
        }
    }
}
