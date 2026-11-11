.PHONY: all start restart logs stop clean

all: start

start:
	docker compose up --yes -d --quiet-pull --build

restart:
	docker compose restart

logs:
	docker compose logs -f

stop:
	docker compose stop

clean:
	docker compose down --volumes
