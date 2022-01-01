[![CI](https://github.com/Alekzanther/motiv/actions/workflows/rust.yml/badge.svg)](https://github.com/Alekzanther/motiv/actions/workflows/rust.yml)

# MOTIV

A place for your family photos and videos... Some day!

## State 
- Serves SPAs
- Talks GraphQL
- Stores in postgres
- Doesn't crash. 

## Development Prerequisites
 - yarn
 - node
 - rust
 - diesel_cli
 - postgres client (required for compilation apparently)
 - postgres server
    - docker run --name some-postgres -p 5432:5432 -e POSTGRES_PASSWORD=mysecretpassword -d postgres
 - DATABASE_URL environment variable set with postgres connection details 
    - example: DATABASE_URL=postgres://postgres:mysecretpassword@localhost:5432/postgres
 
## Build / run (incomplete, missing docker/postgres/.env-file)
1. check / change examples in motiv.toml
1. "make build" in the source dir
1. Cargo run to start the server
1. Go to localhost:5000 in a web browser, there's a graphql-viewer at /graphql as well.


## Acknowledgements

Special thanks to @lucperkins and his repository at https://github.com/lucperkins/rust-graphql-juniper-actix-diesel-postgres 
