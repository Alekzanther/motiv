use crate::config::*;
use image::{imageops, GenericImageView};
use imageops::{resize, FilterType};
use log::{error, info};
use std::error::Error;
use std::fs::File;
use std::io::Write;
use std::sync::Arc;
use thiserror::Error as ThisError;

pub fn cache_image(
    config: Arc<Config>,
    original_file: &str,
    index_id: &str,
) -> Result<i32, Box<dyn Error>> {
    let destination_path = &config
        .cache_path
        .as_ref()
        .unwrap_or(&".cache".to_string())
        .clone();

    if processed_media_files_exist(index_id, destination_path.as_str()) {
        return Ok(0);
    }

    let img = image::open(original_file)?;
    let img_bytes = img.to_rgba8();
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
        .cache_image_settings
        .unwrap()
        .large_pixels
        .unwrap_or(IMAGE_CACHE_FALLBACK_LARGE);
    let large_thumb_q = config
        .cache_image_settings
        .unwrap()
        .large_quality
        .unwrap_or(IMAGE_CACHE_FALLBACK_LARGE_Q);

    let medium_thumb = config
        .cache_image_settings
        .unwrap()
        .medium_pixels
        .unwrap_or(IMAGE_CACHE_FALLBACK_LARGE);
    let medium_thumb_q = config
        .cache_image_settings
        .unwrap()
        .medium_quality
        .unwrap_or(IMAGE_CACHE_FALLBACK_LARGE_Q);

    let small_thumb = config
        .cache_image_settings
        .unwrap()
        .small_pixels
        .unwrap_or(IMAGE_CACHE_FALLBACK_LARGE);
    let small_thumb_q = config
        .cache_image_settings
        .unwrap()
        .small_quality
        .unwrap_or(IMAGE_CACHE_FALLBACK_LARGE_Q);

    if largest >= large_thumb {
        let destination = format!("{}/{}_l.webp", destination_path, index_id);
        if !std::path::Path::new(destination.as_str()).exists() {
            let (nwidth, nheight) = get_new_dimensions(aspect, large_thumb);

            match generate_specific_size(
                &img_bytes,
                nwidth,
                nheight,
                large_thumb_q,
                &destination,
            ) {
                Ok(_) => {
                    thumb_count += 1;
                }
                Err(e) => {
                    error!("Couldn't generate thumb: {:?}", e);
                    return Err(e);
                }
            }
        }
    }
    if largest >= medium_thumb {
        let destination = format!("{}/{}_m.webp", destination_path, index_id);
        if !(std::path::Path::new(destination.as_str()).exists()) {
            let (nwidth, nheight) = get_new_dimensions(aspect, medium_thumb);
            match generate_specific_size(
                &img_bytes,
                nwidth,
                nheight,
                medium_thumb_q,
                &destination,
            ) {
                Ok(_) => {
                    thumb_count += 1;
                }
                Err(e) => {
                    error!("Couldn't generate thumb: {:?}", e);
                    return Err(e);
                }
            }
        }
    }
    if largest >= small_thumb {
        let destination = format!("{}/{}_s.webp", destination_path, index_id);
        if !std::path::Path::new(destination.as_str()).exists() {
            let (nwidth, nheight) = get_new_dimensions(aspect, small_thumb);
            match generate_specific_size(
                &img_bytes,
                nwidth,
                nheight,
                small_thumb_q,
                &destination,
            ) {
                Ok(_) => {
                    thumb_count += 1;
                }
                Err(e) => {
                    error!("Couldn't generate thumb: {:?}", e);
                    return Err(e);
                }
            }
        }
    }

    info!("Processed {} thumbs for id {}", thumb_count, index_id);
    Ok(thumb_count)
}

fn generate_specific_size(
    img_buffer: &image::ImageBuffer<image::Rgba<u8>, Vec<u8>>,
    width: u32,
    height: u32,
    quality: u8,
    destination: &str,
) -> Result<(), Box<dyn Error>> {
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

    let nimage = resize(img_buffer, width, height, filter_type);
    let webp_image = encode_webp(nimage.as_ref(), width, height, 70);
    if let Ok(webp_image) = webp_image {
        let mut file = File::create(destination)?;
        file.write_all(webp_image.as_ref())
            .unwrap_or_else(|destination| {
                error!("Couldn't write thumb {} files", destination)
            });
    }
    //To test/compare with jpg, uncomment this:
    //let mut string_test = destination.clone();
    //string_test.push_str(".jpg");
    //nimage.save(string_test)?;

    Ok(())
}

fn get_new_dimensions(aspect_ratio: f32, max_size: u32) -> (u32, u32) {
    if aspect_ratio >= 1.0 {
        (max_size, ((max_size as f32) / aspect_ratio) as u32)
    } else {
        (((max_size as f32) * aspect_ratio) as u32, max_size)
    }
}

#[derive(ThisError, Debug)]
pub enum WebPEncodeError {
    #[error("Unknown error encoding WebP")]
    Unknown,
}

pub fn encode_webp(
    input_image: &[u8],
    width: u32,
    height: u32,
    quality: i32,
) -> Result<Vec<u8>, WebPEncodeError> {
    unsafe {
        let mut out_buf = Box::into_raw(Box::new(0u8)) as *mut _;
        let stride = width as i32 * 4;
        let len = libwebp_sys::WebPEncodeRGBA(
            input_image.as_ptr(),
            width as i32,
            height as i32,
            stride,
            quality as f32,
            &mut out_buf as *mut _,
        );
        Ok(Vec::from_raw_parts(out_buf, len as usize, len as usize))
    }
}

fn processed_media_files_exist(index_id: &str, destination_path: &str) -> bool {
    std::path::Path::new(format!("{}/{}_m.webp", destination_path, index_id).as_str())
        .exists()
        && std::path::Path::new(
            format!("{}/{}_s.webp", destination_path, index_id).as_str(),
        )
        .exists()
        && std::path::Path::new(
            format!("{}/{}_l.webp", destination_path, index_id).as_str(),
        )
        .exists()
}
