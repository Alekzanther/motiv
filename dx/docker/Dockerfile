FROM rust:latest as backend-builder
RUN apt-get update && \
		apt-get install -y postgresql-client 
RUN USER=root
RUN mkdir motiv
WORKDIR /motiv
ADD ./backend ./
RUN cargo install --root /motiv diesel_cli --no-default-features --features postgres
RUN cargo clean && \
    cargo build -vv --release

FROM node:16 as frontend-builder
RUN USER=root
RUN mkdir motiv
WORKDIR /motiv
ADD ./frontend ./
RUN yarn build

FROM debian:stable-slim
RUN apt-get update && \
		apt-get install -y postgresql-client && \
		rm -rf /var/lib/apt/lists/*
ENV APP_USER=appuser
RUN groupadd $APP_USER \
    && useradd -g $APP_USER $APP_USER
RUN mkdir -p /motiv/backend/dummy-data
RUN mkdir -p /motiv/frontend/build
VOLUME /motiv
WORKDIR /motiv
COPY ./backend/motiv.toml /motiv/backend/motiv.toml
COPY ./backend/migrations /motiv/backend/migrations
COPY --from=backend-builder /motiv/target/release/motiv /motiv/backend/motiv
COPY --from=backend-builder /motiv/bin/diesel /motiv/backend
COPY --from=frontend-builder /motiv/build /motiv/frontend/build
RUN chown -R $APP_USER:$APP_USER /motiv
WORKDIR /motiv/backend
CMD ["./motiv"]
