.PHONY: start help

dev:
	docker compose up --watch

help:
	@echo "Available commands:"
	@echo "-------------------"
	@echo "  make dev - Start the backend and frontend Docker containers in development mode."