FROM rust:latest as builder
WORKDIR /usr/src/motiv
COPY ./backend .
RUN cargo install --path .

FROM debian:buster-slim
RUN apt-get update && apt-get install -y postgresql-client && rm -rf /var/lib/apt/lists/*
VOLUME /motiv
WORKDIR /motiv
COPY ./frontend/build /motiv/frontend/build
COPY ./backend/motiv.toml /motiv/backend/motiv.toml
COPY --from=builder /usr/local/cargo/bin/motiv /usr/local/bin/motiv
WORKDIR /motiv/backend
CMD ["motiv"]
