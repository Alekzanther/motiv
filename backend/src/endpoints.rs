use crate::config::Config;
use crate::data::context::GraphQLContext;
use crate::data::db::PostgresPool;
use crate::data::graphql::create_schema;
use crate::data::graphql::Schema;
use crate::models::media::MediaManager;
use actix_files::NamedFile;
use actix_web::{web, Error, HttpResponse};
use juniper::http::playground::playground_source;
use juniper::http::GraphQLRequest;
use log::info;
use std::sync::Arc;

// The configuration callback that enables us to add the /graphql route
// to the actix-web server.
pub fn web_endpoints(config: &mut web::ServiceConfig) {
    let schema = Arc::new(create_schema());
    config
        .data(schema)
        .route("/graphql", web::post().to(graphql))
        .route("/graphql", web::get().to(graphql_playground))
        .service(web::resource("/m/{id}").route(web::get().to(get_original_media_by_id)))
        .service(
            web::resource("/m/{id}/{size}")
                .route(web::get().to(get_processed_media_by_id)),
        )
        .route("/albums", web::get().to(index))
        .route("/favorites", web::get().to(index))
        .route("/tags", web::get().to(index))
        .route("/feed", web::get().to(index))
        .route("/", web::get().to(index));
}

async fn index() -> Result<NamedFile, Error> {
    Ok(NamedFile::open("./frontend/build/index.html")?)
}

/// fetch image body
async fn get_original_media_by_id(
    config: web::Data<Arc<Config>>,
    pool: web::Data<PostgresPool>,
    media_id: web::Path<i32>,
) -> Result<NamedFile, Error> {
    let content =
        MediaManager::get_media_file_by_id(&config, &pool.get().unwrap(), *media_id, -1);
    return Ok(content.unwrap());
}

async fn get_processed_media_by_id(
    config: web::Data<Arc<Config>>,
    pool: web::Data<PostgresPool>,
    params: web::Path<(i32, i32)>,
) -> Result<NamedFile, Error> {
    let content = MediaManager::get_media_file_by_id(
        &config,
        &pool.get().unwrap(),
        params.0,
        params.1,
    );
    info!("Requested media with size {}", params.1);
    return Ok(content.unwrap());
}

// The GraphQL Playground route.
async fn graphql_playground() -> HttpResponse {
    HttpResponse::Ok()
        .content_type("text/html; charset=utf-8")
        .body(playground_source("/graphql"))
}

// The core handler that provides all GraphQL functionality.
async fn graphql(
    // The DB connection pool
    pool: web::Data<PostgresPool>,
    // The GraphQL schema
    schema: web::Data<Arc<Schema>>,
    // The incoming HTTP request
    data: web::Json<GraphQLRequest>,
) -> Result<HttpResponse, Error> {
    // Instantiate a context
    let ctx = GraphQLContext {
        pool: pool.get_ref().to_owned(),
    };

    // Handle the incoming request and return a string result (or error)
    let res = web::block(move || {
        let res = data.execute(&schema, &ctx);
        Ok::<_, serde_json::error::Error>(serde_json::to_string(&res)?)
    })
    .await
    .map_err(Error::from)?;

    // Return the string as a JSON payload
    Ok(HttpResponse::Ok()
        .content_type("application/json")
        .body(res))
}
