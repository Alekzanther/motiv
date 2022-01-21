CARGO = cargo
YARN = yarn
DOCKER = docker
DUMMY_DATA_FOLDER = backend/dummy-data

setup-dev-env:
	# setup media folders
	make fetch-dummy-data
	make reset-db
	# print some helpful message

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

docker-image: 
	$(DOCKER) build -f docker/Dockerfile -t motiv:latest .  

reset-db:
	$(DOCKER) rm -f motiv-dev-db
	$(DOCKER) run --name motiv-dev-db -p 5432:5432 -e POSTGRES_PASSWORD=mysecretpassword -d postgres

fetch-dummy-data:
	mkdir -p $(DUMMY_DATA_FOLDER)/originals/pictures
	mkdir -p $(DUMMY_DATA_FOLDER)/originals/videos
	mkdir -p $(DUMMY_DATA_FOLDER)/cache
	bash docker/fetch-dummy-pictures.sh $(DUMMY_DATA_FOLDER)/originals/pictures

run:
	cd backend && $(CARGO) run 

