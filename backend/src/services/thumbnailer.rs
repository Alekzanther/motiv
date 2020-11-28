use crate::config::*;
use image::{imageops, GenericImageView};
use imageops::{resize, FilterType};
use log::error;
use std::error::Error;

pub fn generate_thumbnails(
    original_file: &str,
    index_id: &str,
) -> Result<i32, Box<dyn Error>> {
    //TODO: The config stuff here should be passed down from some "global config state"
    let cfg_path = "./motiv.toml";
    let config = crate::config::read_config(cfg_path.to_string()).unwrap();

    let destination_path = &config
        .cache_path
        .as_ref()
        .unwrap_or(&".thumbs".to_string())
        .clone();
    let img = image::open(original_file)?;
    let (width, height) = img.dimensions();
    let aspect: f32 = (width as f32 / height as f32) as f32;
    let largest = {
        if width > height {
            width
        } else {
            height
        }
    };
    let mut thumb_count = 0;
    let large_thumb = config
        .thumbnails
        .as_ref()
        .unwrap()
        .large_pixels
        .unwrap_or(THUMB_FALLBACK_LARGE);
    let large_thumb_q = config
        .thumbnails
        .as_ref()
        .unwrap()
        .large_quality
        .unwrap_or(THUMB_FALLBACK_LARGE_Q);

    if largest >= large_thumb {
        let (nwidth, nheight) = get_new_dimensions(aspect, large_thumb);
        let mut destination = destination_path.clone();
        destination.push_str("/l/");
        destination.push_str(index_id);

        match generate_specific_size(
            original_file,
            nwidth,
            nheight,
            large_thumb_q,
            &destination,
        ) {
            Ok(_) => {
                thumb_count += 1;
            }
            Err(e) => {
                error!("Error generating thumb {:?}", e);
            }
        }
    }

    Ok(thumb_count)
}

fn generate_specific_size(
    image_file: &str, //TODO: send in already read image buffer instead of reading file for each size...
    width: u32,
    height: u32,
    quality: u8,
    destination: &String,
) -> Result<(), image::ImageError> {
    let img = image::open(image_file)?;
    let mut filter_type = FilterType::Triangle;
    if quality == 0 {
        filter_type = FilterType::Nearest;
    } else if quality == 1 {
        filter_type = FilterType::Triangle;
    } else if quality == 2 {
        filter_type = FilterType::CatmullRom;
    } else if quality == 3 {
        filter_type = FilterType::Lanczos3;
    }

    let nimage = resize(&img, width, height, filter_type);
    return nimage.save(destination);
}

fn get_new_dimensions(aspect_ratio: f32, max_size: u32) -> (u32, u32) {
    if aspect_ratio >= 1.0 {
        (max_size, ((max_size as f32) / aspect_ratio) as u32)
    } else {
        (((max_size as f32) * aspect_ratio) as u32, max_size)
    }
}
