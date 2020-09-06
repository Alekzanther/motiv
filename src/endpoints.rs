use crate::data::context::GraphQLContext;
use crate::data::db::PostgresPool;
use crate::data::graphql::create_schema;
use crate::data::graphql::Schema;
use crate::models::media::Media;
use crate::schema::media;
use crate::schema::media::dsl::*;
use actix_files::Files;
use actix_utils::mpsc;
use actix_web::{web, Error, HttpResponse};
use bytes::Bytes;
use diesel::pg::PgConnection;
use diesel::prelude::*;
use juniper::http::playground::playground_source;
use juniper::http::GraphQLRequest;
use std::sync::Arc;

// The configuration callback that enables us to add the /graphql route
// to the actix-web server.
pub fn web_endpoints(config: &mut web::ServiceConfig) {
    let schema = Arc::new(create_schema());
    config
        .data(schema)
        .route("/graphql", web::post().to(graphql))
        .route("/graphql", web::get().to(graphql_playground))
        .service(web::resource("/m/{id}").route(web::get().to(media_id)))
        .service(
            Files::new("/", "./frontend/build")
                .index_file("index.html")
                .show_files_listing(),
        );
}

/// fetch image body
async fn media_id(
    pool: web::Data<PostgresPool>,
    media_id: web::Path<i32>,
) -> HttpResponse {
    let text = format!("Hello {}!", *media_id);

    let conn: &PgConnection = &pool.get().unwrap();
    match media.find(*media_id).get_result::<Media>(conn) {
        Ok(res_media) => {
            let (tx, rx_body) = mpsc::channel();
            let _ = tx.send(Ok::<_, Error>(Bytes::from(hämtabytesfrånpath)));
            HttpResponse::Ok().streaming(rx_body)
        },
        Err(e) => match e {
            HttpResponse::.from_error(e)
        },
    }
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
