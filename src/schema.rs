use juniper::{Context, FieldResult};

use crate::media::{Media, MediaDatabase};
use rocket::{response::content, State};
pub struct Query;

impl Context for MediaDatabase {}

#[juniper::object(
    Context = MediaDatabase,
)]
impl Query {
    fn apiVersion() -> &str {
        "1.0"
    }

    fn media(context: &MediaDatabase, id: i32) -> FieldResult<&Media> {
        let media = context.get_media(&id);
        Ok(media.unwrap())
    }
}

// Now, we do the same for our Mutation type.

pub struct Mutation;

#[juniper::object(
    Context = MediaDatabase,
)]
impl Mutation {}

// A root schema consists of a query and a mutation.
// Request queries can be executed against a RootNode.
pub type Schema = juniper::RootNode<'static, Query, Mutation>;

#[rocket::get("/graphiql")]
pub fn graphiql() -> content::Html<String> {
    juniper_rocket::graphiql_source("/graphql")
}

#[rocket::get("/graphql?<request>")]
pub fn get_graphql_handler(
    context: State<MediaDatabase>,
    request: juniper_rocket::GraphQLRequest,
    schema: State<Schema>,
) -> juniper_rocket::GraphQLResponse {
    request.execute_sync(&schema, &context)
}

#[rocket::post("/graphql", data = "<request>")]
pub fn post_graphql_handler(
    context: State<MediaDatabase>,
    request: juniper_rocket::GraphQLRequest,
    schema: State<Schema>,
) -> juniper_rocket::GraphQLResponse {
    request.execute_sync(&schema, &context)
}
