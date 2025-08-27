# @two/two

Copyright (c) 2023-Present The Way Out, Inc. All Rights Reserved.

## Setup

To get the monorepo configured and started for development, simply follow these steps:

```shell
# Install dependencies (1)
yarn install

# Compile TypeScript (2)
yarn build

# Build images (3)
docker-compose build

# Start containers (4)
docker-compose up

# Start frontends (5)
yarn workspace @two/web dev
```

These commands will **(1)** install dependencies for all packages, **(2)** compile TypeScript code for usage and Intellisense, **(3)** build Docker images for backend packages and their dependencies, and **(4)** launch those containers in a configured development environment. You can then **(5)** launch the frontend package(s) you want to work on.

**Note:** Multiple packages in this repository depend on private Disruptive Labs packages installed from the NPM package repository. To retrieve these packages, you must have an `NPM_TOKEN` environment variable exported and available before running yarn commands or building containers. If you do not have access to Disruptive Labs packages and are receiving permissions errors from NPM, please request access by sending an email containing your name, your company, and the repository name to [hello@disruptivelabs.io](mailto:hello@disruptivelabs.io).

**_IMPORTANT: Private Disruptive Labs packages are UNLICENSED and should not be disributed, shared, transferred, installed in other repositories, or used in any way other than for the purpose of running the application(s) in this repository unless expressly authorized in writing by Disruptive Labs LLC._**

## Packages

This repository is a monorepo containing multiple different packages that together make up the full platform. Each package has a specific focus and contains a README with additional useful information.

- [API](packages/api/README.md) - Backend REST API
- [App](packages/app/README.md) - Mobile app (Android/iOS)
- [AWS](packages/aws/README.md) - AWS deployment (CDK)
- [Config](packages/config/README.md) - Configuration/settings
- [Mail](packages/mail/README.md) - Email sending and templates
- [Web](packages/web/README.md) - Web frontend (NextJS)

### Configuration

Each package has various configuration options available, and in some cases, environment variables are required to run the package (or its Docker container) in a production or staging environment. Check the READMEs linked above and take a look at the docker-compose.yml file for some common configuration options supplied to get the development environment running smoothly.

## Testing

Each package has a full Jest test suite that can be run using the `test` script in the appropriate package.json (e.g. `yarn workspace @two/web test`). Some packages require external dependencies to be running for the tests to run (e.g. API requires Postgres and Redis). Check the test scripts as well as the package READMEs for more information.

There are also a few commands that can be run from the monorepo root:

1. _build_ (`yarn build`), which will compile TypeScript and perform basic build steps in each package directory
2. _clean_ (`yarn clean`), which will delete build and test artifacts in each package directory
3. _lint_ (`yarn lint`), which will run ESLint across the entire monorepo
4. _type-check_ (`yarn type-check`), which will validate TypeScript types across the entire monorepo.

Linting and type-checking should be available automatically in an appropriate code editor as well. VSCode is recommended for working on all packages.

### CI

CircleCI is configured to run tests following a push to Github with code changes. The entire codebase will be linted and type-checked, but only test suites for packages that have changed since their last successful run will be executed. The CircleCI configuration should be adjusted if new packages are added or additional inter-dependencies between packages are created. Use the config.yml file in the .circleci directory to configure the CI jobs themselves and the monorepo.json file to configure which packages are inter-dependent and should be tested when changed.

Continuous deployment can also be enabled so that any code changes that pass testing will be automatically deployed to the running environment in AWS. See the [AWS README](packages/aws/README.md) for more details.
