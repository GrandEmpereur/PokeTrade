.PHONY: build-dev run-dev build-prod run-prod stop logs restart-dev restart-prod

# Build development container without cache
build-dev:
	docker-compose build --no-cache poketrade

# Run development container
run-dev:
	docker-compose up --remove-orphans poketrade -d

# Build production container without cache
build-prod:
	docker-compose build --no-cache poketrade-prod

# Run production container in detached mode
run-prod:
	docker-compose up -d --remove-orphans poketrade-prod

# Stop and remove all containers
stop:
	docker-compose down

# View logs
logs:
	docker-compose logs -f

# Restart services
restart-dev: stop build-dev run-dev
restart-prod: stop build-prod run-prod
