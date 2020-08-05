# MOTIV

A place for your family photos and videos... Some day!

## State 
- Serves SPAs
- Talks GraphQL
- Stores in postgres
- Doesn't crash. 

## Prerequisites
 - yarn
 - node
 - rust
 - docker/postgres? 

## Build / run (incomplete, missing docker/postgres/.env-file)
1. Produce frontend artifacts, via:
 1. "make build" in the source dir
 1. go into the "frontend" folder and run yarn 
1. Cargo run to start the server
1. Go to localhost:5000 in a web browser, there's a graphql-viewer at /graphql as well.


## Acknowledgements

Special thanks to @lucperkins and his repository at https://github.com/lucperkins/rust-graphql-juniper-actix-diesel-postgres 
