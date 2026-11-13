.PHONY: all help start restart logs stop clean nuke dev-api dev-web check-api

all: start

help: ## Show this help
	@awk 'BEGIN {FS = ":.*## "} /^[a-zA-Z_-]+:.*## / {printf "  \033[36m%-12s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST)

start: ## Build and start all containers in the background
	docker compose up --yes -d --quiet-pull --build

restart: ## Restart running containers (no rebuild, no config reload)
	docker compose restart

logs: ## Follow logs (all services, or `make logs s=api` for one)
	docker compose logs -f $(s)

stop: ## Stop containers
	docker compose stop

clean: ## Remove containers and networks, keep the database volume
	docker compose down

nuke: ## Remove everything including the database volume (DATA LOSS)
	docker compose down --volumes

dev-api: ## Run the backend locally with cargo (no Docker)
	cd backend && cargo run

dev-web: ## Run the Vite dev server (no Docker)
	pnpm dev

check-api: ## Format check, clippy and tests for the backend
	cd backend && cargo fmt --check && cargo clippy -- -D warnings && cargo test
