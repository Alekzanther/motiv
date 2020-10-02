use crate::data::context::GraphQLContext;
use crate::data::graphql::graphql_translate;
use crate::schema::media;
use crate::schema::media::dsl::*;
use actix_files::NamedFile;
use diesel::pg::PgConnection;
use diesel::prelude::*;
use juniper::{FieldError, FieldResult};
use std::error::Error;

// The core data type undergirding the GraphQL interface
#[derive(juniper::GraphQLObject, Queryable)]
pub struct Media {
    pub id: i32,
    pub name: String,
    pub path: String,
    pub processed: bool,
    pub hash: String,
}

// Methods are automatically picked up by juniper
impl Media {
    pub fn name(&self) -> &str {
        self.name.as_str()
    }

    pub fn path(&self) -> &str {
        self.path.as_str()
    }
    pub fn processed(&self) -> &bool {
        &self.processed
    }
    pub fn hash(&self) -> &str {
        &self.hash.as_str()
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
}

pub struct MediaManager;

impl MediaManager {
    pub fn all_media(context: &GraphQLContext) -> FieldResult<Vec<Media>> {
        let conn: &PgConnection = &context.pool.get().unwrap();
        let result = media.load::<Media>(conn);

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
            path: &new_media.path,
            name: &new_media.name,
            processed: &new_media.processed,
            hash: &new_media.hash,
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
        conn: &PgConnection,
        media_id: i32,
    ) -> Result<NamedFile, Box<dyn Error>> {
        let entry = media.find(media_id).get_result::<Media>(conn);

        match NamedFile::open(entry.unwrap().path) {
            Ok(file) => Ok(file),
            Err(e) => Err(Box::from(e)),
        }
    }

    pub fn get_media_by_path(conn: &PgConnection, find_path: &String) -> Option<Media> {
        let entry = media.filter(path.eq(find_path)).limit(1).get_result(conn);

        if entry.is_ok() {
            return Some(entry.unwrap());
        }
        None
    }
}
