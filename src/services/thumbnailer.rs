use image::{imageops, GenericImageView, ImageResult};
use imageops::{resize, FilterType};
use log::info;

const LARGE: u32 = 860;

pub fn generate_thumbnails(
    original_file: &str,
    index_id: &str,
    destination_folder: &str,
) -> ImageResult<i32> {
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

    if largest >= LARGE {
        let (nwidth, nheight) = get_new_dimensions(aspect, LARGE);
        info!("width {}, height {}", nwidth, nheight);
        let nimage = resize(&img, nwidth, nheight, FilterType::CatmullRom);
        let destination = destination_folder.to_string() + "/l/" + index_id + ".jpg";
        if nimage.save(destination).is_ok() {
            thumb_count += 1;
        }
    }

    Ok(thumb_count)
}

fn get_new_dimensions(aspect_ratio: f32, max_size: u32) -> (u32, u32) {
    if aspect_ratio >= 1.0 {
        (max_size, ((max_size as f32) / aspect_ratio) as u32)
    } else {
        (((max_size as f32) * aspect_ratio) as u32, max_size)
    }
}
