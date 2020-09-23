use image::{imageops, DynamicImage, GenericImageView, ImageResult};
use imageops::{resize, FilterType};
use log::info;

const LARGE: u32 = 1920;
const MEDIUM: u32 = 1024;
const SMALL: u32 = 512;
const EXTRA_SMALL: u32 = 256;

pub fn generate_thumbnails(
    original_file: &str,
    index_id: &str,
    destination_folder: &str,
) -> ImageResult<(i32)> {
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
    let mut thumbSizes = 0;

    if largest >= LARGE {
        let (nwidth, nheight) = get_new_dimensions(&img, aspect, LARGE);
        info!("width {}, height {}", nwidth, nheight);
        let nimage = imageops::resize(&img, nwidth, nheight, FilterType::CatmullRom);
        let destination = destination_folder.to_string() + "/l/" + index_id + ".jpg";
        nimage.save(destination);
        thumbSizes += 1;
    }

    Ok(thumbSizes)
}

fn get_new_dimensions(
    img: &DynamicImage,
    aspect_ratio: f32,
    max_size: u32,
) -> (u32, u32) {
    if aspect_ratio >= 1.0 {
        (max_size, ((max_size as f32) / aspect_ratio) as u32)
    } else {
        (((max_size as f32) * aspect_ratio) as u32, max_size)
    }
}
