use super::image_cacher::cache_image;
use crate::config::Config;
use crate::models::media::MediaUpdate;
use crate::models::media::{Media, MediaType};
use crate::schema::media::dsl::*;
use diesel::pg::PgConnection;
use diesel::prelude::*;
use log::{error, info};
use rayon::prelude::*;
use std::sync::Arc;

pub fn process_unprocessed(config: Arc<Config>, conn: &PgConnection) {
    let mut unprocessed = get_unprocessed_media(conn);
    while !unprocessed.is_empty() {
        let processed_media: Vec<_> = unprocessed
            .par_iter()
            .map(|unprocessed_media| {
                info!("Processing {}", unprocessed_media.id);
                match cache_image(
                    config.clone(),
                    unprocessed_media.path.as_str(),
                    unprocessed_media.id.to_string().as_str(),
                ) {
                    Ok(thumbs_count) => {
                        if thumbs_count == 0 {
                            Err(())
                        } else {
                            Ok(MediaUpdate {
                                id: &unprocessed_media.id,
                                processed: Some(&true),
                                processed_levels: Some(thumbs_count),
                            })
                        }
                    }
                    Err(_e) => Err(()),
                }
            })
            .filter_map(|x| x.ok())
            .collect();

        if !processed_media.is_empty() {
            let update_media_results = update_processed_media(conn, &processed_media);

            let successful_updates = update_media_results
                .iter()
                .filter_map(|x| x.as_ref().ok())
                .count();
            info!("Processed and updated {}", successful_updates);

            update_media_results
                .iter()
                .filter_map(|x| x.as_ref().err())
                .for_each(|e| {
                    error!("Error updating db with processed thumbs: {:?}", e)
                });
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
    processed_media: &Vec<MediaUpdate>,
) -> Vec<Result<usize, diesel::result::Error>> {
    processed_media
        .iter()
        .map(|m| {
            diesel::update(media.filter(id.eq(m.id)))
                .set(m)
                .execute(conn)
        })
        .collect()
}
