use crate::data::graphql::graphql_translate;
use crate::schema::media;
use crate::schema::media::dsl::*;
use diesel::pg::PgConnection;
use diesel::prelude::*;
use juniper::{graphql_value, FieldError, FieldResult, GraphQLInputObject};

// The core data type undergirding the GraphQL interface
#[derive(juniper::GraphQLObject, Queryable)]
pub struct Media {
    pub id: i32,
    pub name: String,
    pub path: String,
}

// Methods are automatically picked up by juniper
impl Media {
    fn id(&self) -> i32 {
        self.id
    }

    pub fn name(&self) -> &str {
        self.name.as_str()
    }

    pub fn path(&self) -> &str {
        self.path.as_str()
    }
}

// Used to create new Media
#[derive(Insertable, AsChangeset)]
#[table_name = "media"]
pub struct NewMedia<'a> {
    pub name: &'a str,
    pub path: &'a str,
}

// The GraphQL input object for creating Media
//#[derive(GraphQLInputObject)]
//pub struct CreateMediaInput {
//    pub name: String,
//    pub path: String,
//}

pub struct MediaManager;

impl MediaManager {
    pub fn all_media(conn: &PgConnection) -> FieldResult<Vec<Media>> {
        let result = media.load::<Media>(conn);

        graphql_translate(result)
    }

    pub fn upsert(conn: &PgConnection, new_media: &NewMedia) -> FieldResult<Media> {
        let new_media = NewMedia {
            path: &new_media.path,
            name: &new_media.name,
        };

        let res = diesel::insert_into(media::table)
            .values(&new_media)
            .on_conflict(path)
            .do_update()
            .set(&new_media)
            .get_result(conn);

        graphql_translate(res)
    }
}
