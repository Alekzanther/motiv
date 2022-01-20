use crate::config::Config;
use diesel::pg::PgConnection;
use diesel::r2d2::ConnectionManager;
use diesel_migrations::run_pending_migrations;
use r2d2::Pool;

pub type PostgresPool = Pool<ConnectionManager<PgConnection>>;

pub fn get_pool(config: std::sync::Arc<Config>) -> PostgresPool {
    //build pool
    let url = &config.database.url.clone();
    let mgr = ConnectionManager::<PgConnection>::new(url);
    let pool = r2d2::Pool::builder()
        .build(mgr)
        .expect("could not build connection pool");

    //migration
    run_pending_migrations(&pool.get().unwrap()).unwrap();
    pool
}
