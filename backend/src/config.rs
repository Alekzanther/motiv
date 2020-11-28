use serde::Deserialize;
use std::fs;
use std::io;
use toml;

pub const THUMB_FALLBACK_LARGE: u32 = 1024;
pub const THUMB_FALLBACK_LARGE_Q: u8 = 1;
pub const THUMB_FALLBACK_MEDIUM: u32 = 512;
pub const THUMB_FALLBACK_MEDIUM_Q: u8 = 1;
pub const THUMB_FALLBACK_SMALL: u32 = 64;
pub const THUMB_FALLBACK_SMALL_Q: u8 = 1;

//TODO: Instead of option everywhere, separate "parsed" configs (with option) from actually used
//config (with defaults for missing pieces)

#[derive(Clone, Debug, Deserialize)]
pub struct Config {
    pub port: Option<u16>,
    pub name: Option<String>,
    pub media: Option<Vec<MediaPath>>,
    pub cache_path: Option<String>,
    pub thumbnails: Option<Thumbnails>,
    pub database: PostgresCredentials,
}

#[derive(Copy, Clone, Debug, Deserialize)]
pub struct Thumbnails {
    pub small_pixels: Option<u32>,
    pub medium_pixels: Option<u32>,
    pub large_pixels: Option<u32>,
    pub small_quality: Option<u8>,
    pub medium_quality: Option<u8>,
    pub large_quality: Option<u8>,
}

#[derive(Clone, Debug, Deserialize)]
pub struct PostgresCredentials {
    pub url: String,
}

#[derive(Clone, Debug, Deserialize)]
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
        Ok(result) => Ok(add_defaults(result)),
        Err(e) => Err(io::Error::new(io::ErrorKind::Other, e)),
    }
}

fn add_defaults(cfg: Config) -> Config {
    Config {
        port: Some(cfg.port.unwrap_or(5000)),
        name: Some(cfg.name.unwrap_or("Motiv".to_string())),
        media: Some(cfg.media.unwrap_or(vec![MediaPath {
            path: "./media/".to_string(),
            name: Some("My local media".to_string()),
        }])),
        cache_path: Some(cfg.cache_path.unwrap_or(".thumbs".to_string())),
        thumbnails: Some(cfg.thumbnails.unwrap_or(Thumbnails {
            small_pixels: Some(THUMB_FALLBACK_SMALL),
            medium_pixels: Some(THUMB_FALLBACK_MEDIUM),
            large_pixels: Some(THUMB_FALLBACK_LARGE),
            small_quality: Some(THUMB_FALLBACK_SMALL_Q),
            medium_quality: Some(THUMB_FALLBACK_MEDIUM_Q),
            large_quality: Some(THUMB_FALLBACK_LARGE_Q),
        })),
        database: cfg.database,
    }
}
