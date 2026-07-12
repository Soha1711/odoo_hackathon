# Deployment Guidelines

This document details the configuration for running EcoSphere locally and in production.

## Docker Setup

### Local Services (`docker/docker-compose.yml`)
Runs the local PostgreSQL instance.

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    container_name: ecosphere-db
    ports:
      - "5432:5432"
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
      POSTGRES_DB: ecosphere
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

## CI/CD Pipeline
GitHub actions configured under `.github/workflows/` check build integrity and linting on every pull request.
