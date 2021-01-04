CARGO = cargo
YARN = yarn
DOCKER = docker

build:
	$(YARN) --cwd frontend install
	$(YARN) --cwd frontend build
	$(CARGO) build --manifest-path backend/Cargo.toml

check:
	$(CARGO) check --manifest-path backend/Cargo.toml

fmt:
	$(CARGO) fmt --manifest-path backend/Cargo.toml

open:
	open http://localhost:5000/graphql

release:
	$(CARGO) build --release --manifest-path backend/Cargo.toml

docker: 
	$(YARN) --cwd frontend install
	$(YARN) --cwd frontend build
	$(DOCKER) build -f docker/Dockerfile -t motiv .  


run:
	$(CARGO) run --manifest-path backend/Cargo.toml

