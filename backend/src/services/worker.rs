use super::thumbnailer::generate_thumbnails;
use crate::config::Config;
use crate::models::media::Media;
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
        let generation_failures: Vec<_> = unprocessed
            .par_iter()
            .map(|unprocessed_media| {
                info!("Processing {}", unprocessed_media.id);
                generate_thumbnails(
                    config.clone(),
                    unprocessed_media.path.as_str(),
                    unprocessed_media.id.to_string().as_str(),
                )
                .map_err(|_e| unprocessed_media.path.to_string())
            })
            .filter_map(|x| x.err())
            .collect();

        if generation_failures.len() > 0 {
            error!("Failed generating {} thumbs", generation_failures.len());
            generation_failures.iter().for_each(|x| error!("{:?}", x));
        }

        unprocessed = get_unprocessed_media(conn);
    }
}

fn get_unprocessed_media(conn: &PgConnection) -> Vec<Media> {
    media
        .filter(processed.eq(false))
        .limit(100)
        .load(conn)
        .expect("Error loading thumbnails!")
}
