#![feature(proc_macro_hygiene, decl_macro)]

#[macro_use]
use rocket_contrib::serve::StaticFiles;

mod media;
mod schema;
mod scraper;

use media::MediaDatabase;

fn main() {
    scraper::index_media("/home/alexander/cloud/Backgrounds");
    rocket::ignite()
        .manage(MediaDatabase::new())
        .manage(crate::schema::Schema::new(schema::Query, schema::Mutation))
        .mount("/", StaticFiles::from("frontend/build"))
        .mount("/graphiql", rocket::routes![schema::graphiql])
        .mount(
            "/graphql",
            rocket::routes![schema::get_graphql_handler, schema::post_graphql_handler],
        )
        .launch();
}
