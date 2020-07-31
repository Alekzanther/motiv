use serde::Deserialize;
use std::fs;
use std::io;
use toml;

#[derive(Debug, Deserialize)]
pub struct Config {
    pub port: Option<u16>,
    pub name: Option<String>,
    pub media: Option<Vec<MediaPath>>,
}

#[derive(Debug, Deserialize)]
pub struct MediaPath {
    pub path: String,
    pub name: Option<String>,
}

pub fn read_config(config_filename: String) -> Result<Config, io::Error> {
    let config = fs::read_to_string(config_filename);
    let config = match config {
        Ok(contents) => contents,
        Err(e) => return Err(e),
    };

    let toml_result = toml::from_str(&config);
    match toml_result {
        Ok(result) => Ok(result),
        Err(e) => Err(io::Error::new(io::ErrorKind::Other, e)),
    }
}
