# Repeatable commands for working on BoxBreathing.
YARN := yarn

API_PORT := 3001

.DEFAULT_GOAL := help
.PHONY: help setup install web api build build-web build-api lint lint-web lint-api \
        db db-stop db-logs db-reset test clean reset


setup: install ## First-time setup: enable Corepack, then install everything
	corepack enable

install: ## Install workspace dependencies
	$(YARN) install


web: ## Run the Next.js app on http://localhost:3000
	$(YARN) dev:web

api: ## Run the NestJS API on http://localhost:3001
	PORT=$(API_PORT) $(YARN) dev:api


db: ## Start the database container in the background
	docker compose up -d

db-stop: ## Stop the database container
	docker compose down

db-logs: ## Follow the database container logs
	docker compose logs -f

db-reset: ## Destroy the database container and its volumes, then start fresh
	docker compose down -v
	docker compose up -d



build: build-web build-api ## Build both apps

build-web: ## Build the Next.js app
	$(YARN) build:web

build-api: ## Build the NestJS API
	$(YARN) build:api

lint: lint-web lint-api ## Lint both apps

lint-web: ## Lint the Next.js app
	$(YARN) lint:web

lint-api: ## Lint the NestJS API (fixes what it can)
	$(YARN) lint:api

test: ## Run the API test suite
	$(YARN) workspace api test


clean: ## Remove build output and caches
	rm -rf apps/web/.next apps/web/tsconfig.tsbuildinfo
	rm -rf apps/api/dist apps/api/coverage

reset: clean ## Clean, then drop node_modules and reinstall from scratch
	rm -rf node_modules apps/*/node_modules packages/*/node_modules
	$(YARN) install
