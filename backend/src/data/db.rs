use crate::config::Config;
use diesel::pg::PgConnection;
use diesel::r2d2::ConnectionManager;
use r2d2::Pool;

pub type PostgresPool = Pool<ConnectionManager<PgConnection>>;

//pub fn run_migrations(config: std::sync::Arc<Config>) {}

pub fn get_pool(config: std::sync::Arc<Config>) -> PostgresPool {
    let url = &config.database.url.clone();
    let mgr = ConnectionManager::<PgConnection>::new(url);
    r2d2::Pool::builder()
        .build(mgr)
        .expect("could not build connection pool") // TODO: handle errors
}
