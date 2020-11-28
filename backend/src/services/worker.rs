use super::thumbnailer::generate_thumbnails;
use crate::config::Config;
use crate::models::media::Media;
use crate::schema::media::dsl::*;
use diesel::pg::PgConnection;
use diesel::prelude::*;
use log::{error, info};
use std::sync::Arc;

//TODO: fix a proper job queue and background jobs system.
pub fn process_unprocessed(config: Arc<Config>, conn: &PgConnection) {
    while let Some(unprocessed_media) = get_unprocessed_media(conn) {
        info!("Found unprocessed media {}", unprocessed_media.path);
        match generate_thumbnails(
            config.clone(),
            unprocessed_media.path.as_str(),
            unprocessed_media.id.to_string().as_str(),
        ) {
            Ok(_result) => {
                match diesel::update(media.find(unprocessed_media.id))
                    .set(processed.eq(true))
                    .execute(conn)
                {
                    Ok(_) => info!("Successfully updated db"),
                    Err(_) => error!("Failed to update processed status of media"),
                }
            }
            Err(_e) => {}
        };
    }
}

fn get_unprocessed_media(conn: &PgConnection) -> Option<Media> {
    let entry = media.filter(processed.eq(false)).limit(1).get_result(conn);

    if entry.is_ok() {
        return Some(entry.unwrap());
    }
    None
}