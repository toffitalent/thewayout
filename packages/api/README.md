# @two/api

Copyright (c) 2023-Present The Way Out, Inc. All Rights Reserved.

## Development

Assuming you've previously followed the commands in the root [README](../../README.md), fire up the API for development by running the following commands from the monorepo root:

```shell
# Build containers
docker-compose build

# Start containers
docker-compose up
```

This will download the required dependency containers (e.g. Postgres, Redis), build the various images, apply all database migrations, and start listening for connections. Your local files are mounted as a volume, so you can modify code directly and the running container will be updated immediately. Ports are also exposed to your host machine, so you can use applications/tools to connect to and explore the database, for example.

## Configuration

Certain features require secrets or additional configuration via environment variables. For development, everything should work out of the box. But for production/staging environments, certain environment variables are required for configuration (see below). Check both the config package and the config directory in this package for more details. _Note:_ Environment variables can be supplied to the container or exported in the environment, or they can be provided using `.env` and `.env.[environment]` files. The latter method is often preferable in development.

### Environment Variables

| Environment Var Name | Config Name            | Description                             | Default                  | Notes                                          |
| -------------------- | ---------------------- | --------------------------------------- | ------------------------ | ---------------------------------------------- |
| `API_AUTH_SECRET`    | `api.auth.secret`      | Secret key for JWT auth token signature |                          | **Required.** Generated during AWS deployment. |
| `API_DB_HOSTNAME`    | `api.db.hostname`      | Database hostname                       | `localhost`              |                                                |
| `API_DB_USERNAME`    | `api.db.username`      | Database username                       | `two`                    |                                                |
| `API_DB_PASSWORD`    | `api.db.password`      | Database password                       |                          | **Required.** Generated during AWS deployment. |
| `API_DB_DATABASE`    | `api.db.database`      | Database name                           | `two`                    |                                                |
| `API_DB_PORT`        | `api.db.port`          | Database port                           | `5432`                   |                                                |
| `API_DB_DEBUG`       | `api.db.debug`         | Enable database debugging               | `false`                  | Only use in development                        |
| `API_REDIS_URL`      | `api.server.store.url` | Redis connection URL                    | `redis://localhost:6379` |                                                |
| `PORT`               | `api.server.port`      | Port to listen on                       | `3000`                   |                                                |

Also check the config package [README](../config/README.md) for environment variables available in the global config.

## Testing

To run all tests and get coverage reports, make sure the required containers are running (`docker-compose up`) and, in the project root, run `yarn workspace @two/api test`.
