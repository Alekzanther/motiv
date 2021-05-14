use serde::Deserialize;
use std::fs;
use std::io;

pub const IMAGE_CACHE_FALLBACK_LARGE: u32 = 1920;
pub const IMAGE_CACHE_FALLBACK_LARGE_Q: u8 = 1;
pub const IMAGE_CACHE_FALLBACK_MEDIUM: u32 = 512;
pub const IMAGE_CACHE_FALLBACK_MEDIUM_Q: u8 = 1;
pub const IMAGE_CACHE_FALLBACK_SMALL: u32 = 64;
pub const IMAGE_CACHE_FALLBACK_SMALL_Q: u8 = 1;

//TODO: Instead of option everywhere, separate "parsed" configs (with option) from actually used
//config (with defaults for missing pieces)

#[derive(Clone, Debug, Deserialize)]
pub struct Config {
    pub port: Option<u16>,
    pub name: Option<String>,
    pub media: Option<Vec<MediaPath>>,
    pub cache_path: Option<String>,
    pub cache_image_settings: Option<CacheSettings>,
    pub database: PostgresCredentials,
    pub worker_threads: Option<usize>,
    pub webapp_path: String,
}

#[derive(Copy, Clone, Debug, Deserialize)]
pub struct CacheSettings {
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
        name: Some(cfg.name.unwrap_or_else(|| "Motiv".to_string())),
        media: Some(cfg.media.unwrap_or_else(|| {
            vec![MediaPath {
                path: "./media/".to_string(),
                name: Some("My local media".to_string()),
            }]
        })),
        cache_path: Some(cfg.cache_path.unwrap_or_else(|| ".thumbs".to_string())),
        cache_image_settings: Some(cfg.cache_image_settings.unwrap_or(CacheSettings {
            small_pixels: Some(IMAGE_CACHE_FALLBACK_SMALL),
            medium_pixels: Some(IMAGE_CACHE_FALLBACK_MEDIUM),
            large_pixels: Some(IMAGE_CACHE_FALLBACK_LARGE),
            small_quality: Some(IMAGE_CACHE_FALLBACK_SMALL_Q),
            medium_quality: Some(IMAGE_CACHE_FALLBACK_MEDIUM_Q),
            large_quality: Some(IMAGE_CACHE_FALLBACK_LARGE_Q),
        })),
        database: cfg.database,
        worker_threads: Some(cfg.worker_threads.unwrap_or(4)),
        webapp_path: cfg.webapp_path,
    }
}
