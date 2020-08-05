CARGO = cargo
YARN = yarn

build:
	$(YARN) --cwd frontend install
	$(YARN) --cwd frontend build
	$(CARGO) build
check:
	$(CARGO) check

fmt:
	$(CARGO) fmt

open:
	open http://localhost:5000/graphql

release:
	$(CARGO) build --release

run:
	$(CARGO) run

