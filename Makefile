CARGO = cargo
YARN = yarn
DOCKER = docker
DOCKER_COMPOSE = docker-compose
DUMMY_DATA_ROOT = backend/dummy-data
DUMMY_PICTURES_PATH = $(DUMMY_DATA_ROOT)/originals/pictures
DUMMY_VIDEOS_PATH = $(DUMMY_DATA_ROOT)/originals/videos
DUMMY_CACHE_PATH = $(DUMMY_DATA_ROOT)/cache

help:
	$(info commands:)
	$(info fetch-dummy-data    # downloads sample data to backend/dummy-data)
	$(info demo                # fetches sample data and starts demo environment)
	$(info demo-refresh        # makes sure the docker images are up to date and starts demo environment)
	$(info remove-demo         # removes the demo environment)
	$(info setup-dev-env       # fetches sample data, resets local dev-postgres, resets backend config, builds everything)
	$(info build               # builds frontend and backend)
	$(info release             # builds backend with release flag)
	$(info docker-image        # builds docker image and tags it with motiv:latest)
	$(info reset-db            # resets local dev db)

demo:
	make fetch-dummy-data
	$(DOCKER_COMPOSE) --project-directory=./ -f dx/docker/docker-compose.yml -f dx/docker/docker-compose.demo.yml up -d 

demo-refresh:
	$(DOCKER_COMPOSE) --project-directory=./ -f dx/docker/docker-compose.yml -f dx/docker/docker-compose.demo.yml pull
	$(DOCKER_COMPOSE) --project-directory=./ -f dx/docker/docker-compose.yml -f dx/docker/docker-compose.demo.yml up -d 

remove-demo:
	$(DOCKER_COMPOSE) --project-directory=./ -f dx/docker/docker-compose.yml -f dx/docker/docker-compose.demo.yml down --remove-orphans
	$(DOCKER_COMPOSE) --project-directory=./ -f dx/docker/docker-compose.yml -f dx/docker/docker-compose.demo.yml rm --force -v 

setup-dev-env:
	# setup media folders
	make fetch-dummy-data
	make reset-db
	cp backend/motiv.toml.example backend/motiv.toml
	make build

build:
	cd frontend && $(YARN) install && $(YARN) build
	$(CARGO) build --manifest-path backend/Cargo.toml

release:
	$(CARGO) build --release --manifest-path backend/Cargo.toml

docker-image: 
	$(DOCKER) build -f dx/docker/Dockerfile -t motiv:latest .  

reset-db:
	$(DOCKER) rm -f motiv-dev-db
	$(DOCKER) run --name motiv-dev-db -p 5432:5432 -e POSTGRES_PASSWORD=mysecretpassword -d postgres

fetch-dummy-data:
	mkdir -p $(DUMMY_PICTURES_PATH)
	mkdir -p $(DUMMY_VIDEOS_PATH)
	mkdir -p $(DUMMY_CACHE_PATH)
	./dx/scripts/fetch-dummy-pictures.sh $(DUMMY_PICTURES_PATH) 
	./dx/scripts/fetch-dummy-gifs.sh $(DUMMY_VIDEOS_PATH) 
	./dx/scripts/fetch-dummy-videos.sh $(DUMMY_VIDEOS_PATH) 

run:
	cd backend && $(CARGO) run 

