use serde::Deserialize;
use std::fs;
use std::io;
use toml;

#[derive(Debug, Deserialize)]
pub struct Config {
    name: Option<String>,
    media: Option<Vec<MediaPath>>,
}

#[derive(Debug, Deserialize)]
pub struct MediaPath {
    path: Option<String>,
    name: Option<String>,
}

pub fn read_config(config_filename: String) -> Result<Config, io::Error> {
    let config = fs::read_to_string(config_filename);
    let mut config = match config {
        Ok(contents) => contents,
        Err(e) => return Err(e),
    };

    let toml_result = toml::from_str(config);
    match toml_result {
        Ok(result) => Ok(result),
        Err(e) => e,
    }
}
