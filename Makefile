CARGO = cargo
YARN = yarn
DOCKER = docker
DUMMY_DATA_ROOT = backend/dummy-data
DUMMY_PICTURES_PATH = $(DUMMY_DATA_ROOT)/originals/pictures
DUMMY_VIDEOS_PATH = $(DUMMY_DATA_ROOT)/originals/videos
DUMMY_CACHE_PATH = $(DUMMY_DATA_ROOT)/cache

setup-dev-env:
	# setup media folders
	make fetch-dummy-data
	make reset-db
	cp backend/motiv.toml.example backend/motiv.toml
	make build
	# print some helpful message

build:
	cd frontend && $(YARN) install && $(YARN) build
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
	mkdir -p $(DUMMY_PICTURES_PATH)
	mkdir -p $(DUMMY_VIDEOS_PATH)
	mkdir -p $(DUMMY_CACHE_PATH)
	./docker/fetch-dummy-pictures.sh $(DUMMY_PICTURES_PATH) 
	./docker/fetch-dummy-gifs.sh $(DUMMY_VIDEOS_PATH) 
	./docker/fetch-dummy-videos.sh $(DUMMY_VIDEOS_PATH) 

run:
	cd backend && $(CARGO) run 

