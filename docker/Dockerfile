FROM rust:latest as builder
RUN USER=root
RUN mkdir motiv
WORKDIR /motiv
ADD ./backend ./
RUN cargo clean && \
    cargo build -vv --release


FROM debian:stable-slim
RUN apt-get update && \
		apt-get install -y postgresql-client && \
		rm -rf /var/lib/apt/lists/*
ENV APP_USER=appuser
RUN groupadd $APP_USER \
    && useradd -g $APP_USER $APP_USER
RUN mkdir -p /motiv/backend
RUN mkdir -p /motiv/frontend/build
VOLUME /motiv
WORKDIR /motiv
COPY ./frontend/build /motiv/frontend/build
COPY ./backend/motiv.toml /motiv/backend/motiv.toml
COPY --from=builder /motiv/target/release/motiv /motiv/backend/motiv
RUN chown -R $APP_USER:$APP_USER /motiv
WORKDIR /motiv/backend
CMD ["./motiv"]
