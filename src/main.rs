#![feature(proc_macro_hygiene, decl_macro)]

#[macro_use]
extern crate rocket;

use rocket_contrib::serve::StaticFiles;

mod scraper;

fn main() {
    scraper::index_media("/home/alexander/cloud/Backgrounds");

    rocket::ignite()
        .mount("/", StaticFiles::from("frontend/build"))
        .launch();
}
