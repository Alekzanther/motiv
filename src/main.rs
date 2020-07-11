#![feature(proc_macro_hygiene, decl_macro)]

#[macro_use]
extern crate rocket;

mod scraper;

#[get("/")]
fn hello() -> &'static str {
    "Hello, world!"
}

fn main() {
    scraper::index_media("/home/alexander/cloud/Backgrounds");
    rocket::ignite().mount("/", routes![hello]).launch();
}
