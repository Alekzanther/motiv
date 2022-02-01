use crate::api::context::GraphQLContext;
use crate::api::graphql::graphql_translate;
use crate::config::Config;
use crate::schema::media;
use crate::schema::media::dsl::*;
use actix_files::NamedFile;
use diesel::pg::PgConnection;
use diesel::prelude::*;
use juniper::{FieldError, FieldResult};
use juniper::{GraphQLEnum, GraphQLInputObject, GraphQLObject};
use std::error::Error;
use std::sync::Arc;

pub enum MediaType {
    Unknown = 0,
    Image,
    Video,
    Gif,
}

#[derive(GraphQLEnum)]
pub enum SortOrder {
    Asc,
    Desc,
}

#[derive(GraphQLInputObject)]
pub struct MediaOrderBy {
    pub timestamp: SortOrder,
}

// The core data type undergirding the GraphQL interface
#[derive(GraphQLObject, Queryable)]
pub struct Media {
    pub id: i32,
    pub name: String,
    pub path: String,
    pub processed: bool,
    pub hash: String,
    pub modified: i32,
    pub timestamp: i32,
    pub media_type: i32,
}

// Methods are automatically picked up by juniper
impl Media {
    pub fn name(&self) -> &str {
        self.name.as_str()
    }

    pub fn path(&self) -> &str {
        self.path.as_str()
    }
    pub fn processed(&self) -> bool {
        self.processed
    }
    pub fn hash(&self) -> &str {
        self.hash.as_str()
    }
    pub fn modified(&self) -> i32 {
        self.modified
    }
}

// Used to create new Media
#[derive(Insertable, AsChangeset)]
#[table_name = "media"]
pub struct NewMedia<'a> {
    pub name: &'a str,
    pub path: &'a str,
    pub processed: &'a bool,
    pub hash: &'a str,
    pub modified: &'a i32,
    pub timestamp: &'a i32,
    pub media_type: &'a i32,
}

pub struct MediaManager {
    pub config: Arc<Config>,
}

impl MediaManager {
    pub fn all_media(
        context: &GraphQLContext,
        order_by: Option<MediaOrderBy>,
    ) -> FieldResult<Vec<Media>> {
        let conn: &PgConnection = &context.pool.get().unwrap();

        let result = {
            if let Some(order_by) = order_by {
                match order_by.timestamp {
                    SortOrder::Asc => {
                        media.order_by(timestamp.asc()).load::<Media>(conn)
                    }
                    SortOrder::Desc => {
                        media.order_by(timestamp.desc()).load::<Media>(conn)
                    }
                }
            } else {
                media.load::<Media>(conn)
            }
        };
        graphql_translate(result)
    }

    pub fn get_media_by_id(
        context: &GraphQLContext,
        media_id: i32,
    ) -> FieldResult<Option<Media>> {
        let conn: &PgConnection = &context.pool.get().unwrap();
        match media.find(media_id).get_result::<Media>(conn) {
            Ok(res_media) => Ok(Some(res_media)),
            Err(e) => match e {
                // Without this translation, GraphQL will return an error rather
                // than the more semantically sound JSON null if no TODO is found.
                diesel::result::Error::NotFound => FieldResult::Ok(None),
                _ => FieldResult::Err(FieldError::from(e)),
            },
        }
    }

    pub fn upsert(conn: &PgConnection, new_media: &NewMedia) -> FieldResult<Media> {
        let new_media = NewMedia {
            path: new_media.path,
            name: new_media.name,
            processed: new_media.processed,
            hash: new_media.hash,
            modified: new_media.modified,
            timestamp: new_media.timestamp,
            media_type: new_media.media_type,
        };

        let res = diesel::insert_into(media::table)
            .values(&new_media)
            .on_conflict(path)
            .do_update()
            .set(&new_media)
            .get_result(conn);

        graphql_translate(res)
    }

    pub fn get_media_file_by_id(
        config: &Arc<Config>,
        conn: &PgConnection,
        media_id: i32,
        size: i32,
    ) -> Result<NamedFile, Box<dyn Error>> {
        if size < 0 {
            let entry = media.find(media_id).get_result::<Media>(conn);

            match NamedFile::open(entry.unwrap().path) {
                Ok(file) => Ok(file),
                Err(e) => Err(Box::from(e)),
            }
        } else {
            let cache_path = config
                .cache_path
                .clone()
                .unwrap_or_else(|| ".thumbs".to_string());
            let mut file_ending = "l.webp";
            if size == 0 {
                file_ending = "s.webp";
            } else if size == 1 {
                file_ending = "m.webp";
            }

            let filename = format!("{}/{}_{}", cache_path, media_id, file_ending);
            match NamedFile::open(filename) {
                Ok(file) => Ok(file),
                Err(e) => Err(Box::from(e)),
            }
        }
    }

    pub fn get_media_by_path(conn: &PgConnection, find_path: &str) -> Option<Media> {
        let entry_result = media.filter(path.eq(find_path)).limit(1).get_result(conn);

        match entry_result {
            Ok(entry) => Some(entry),
            Err(..) => None,
        }
    }
}
