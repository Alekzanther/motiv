extern crate actix_files;
extern crate actix_rt;
extern crate actix_web;
extern crate diesel;
extern crate dotenv;
extern crate env_logger;
extern crate juniper;
extern crate motiv;
extern crate r2d2;
extern crate serde;
extern crate toml;

use std::{env, io};

use actix_web::{middleware, App, HttpServer};

use motiv::config;
use motiv::db::get_pool;
use motiv::endpoints::web_endpoints;

#[actix_rt::main]
async fn main() -> io::Result<()> {
    logging_setup();

    let cfg = config::read_config("./motiv.toml".to_string());
    let cfg = match cfg {
        Ok(result) => result,
        Err(e) => return Err(e),
    };
    println!(
        "Starting up on {}",
        ("0.0.0.0:".to_string() + &(cfg.port.unwrap_or(4000)).to_string())
    );
    // Instantiate a new connection pool
    let pool = get_pool();

    // Start up the server, passing in (a) the connection pool
    // to make it available to all endpoints and (b) the configuration
    // function that adds the /graphql logic.
    HttpServer::new(move || {
        App::new()
            .data(pool.clone())
            .wrap(middleware::Logger::default())
            .configure(web_endpoints)
    })
    .bind("0.0.0.0:4000")?
    .run()
    .await
}

// TODO: more fine-grained logging setup
fn logging_setup() {
    env::set_var("RUST_LOG", "actix_web=info");
    env_logger::init();
}
