use super::thumbnailer::cache_image;
use crate::config::Config;
use crate::models::media::{Media, MediaType};
use crate::schema::media::dsl::*;
use diesel::pg::PgConnection;
use diesel::prelude::*;
use log::{error, info};
use rayon::prelude::*;
use std::sync::Arc;

//TODO: fix proper error handling/reporting
pub fn process_unprocessed(config: Arc<Config>, conn: &PgConnection) {
    let mut unprocessed = get_unprocessed_media(conn);
    while unprocessed.len() > 0 {
        let processed_media: Vec<_> = unprocessed
            .par_iter()
            .map(|unprocessed_media| {
                info!("Processing {}", unprocessed_media.id);
                match cache_image(
                    config.clone(),
                    unprocessed_media.path.as_str(),
                    unprocessed_media.id.to_string().as_str(),
                ) {
                    Ok(_thumbs_count) => Ok(unprocessed_media),
                    Err(_e) => Err(()),
                }
            })
            .filter_map(|x| x.ok())
            .collect();

        if processed_media.len() > 0 {
            match update_processed_media(conn, &processed_media) {
                Ok(result) => info!("Processed and updated {}", result),
                Err(e) => error!("Error updating db with processed thumbs: {:?}", e),
            }
        }

        if processed_media.len() != unprocessed.len() {
            let failed = unprocessed.len() - processed_media.len();
            error!("Couldn't process {} of {} media", failed, unprocessed.len());
        }

        //Get next batch to process...
        unprocessed = get_unprocessed_media(conn);
    }
}

fn get_unprocessed_media(conn: &PgConnection) -> Vec<Media> {
    media
        .filter(
            processed
                .eq(false)
                .and(media_type.eq(MediaType::Image as i32)),
        )
        .limit(16)
        .load(conn)
        .expect("Error getting unprocessed media")
}

fn update_processed_media(
    conn: &PgConnection,
    processed_media: &Vec<&Media>,
) -> Result<usize, diesel::result::Error> {
    let media_ids: Vec<i32> = processed_media.iter().map(|m| m.id).collect();
    diesel::update(media.filter(id.eq_any(media_ids)))
        .set(processed.eq(true))
        .execute(conn)
}
