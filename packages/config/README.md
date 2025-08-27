# @two/config

Copyright (c) 2023-Present The Way Out, Inc. All Rights Reserved.

## Development

This package contains the global platform configuration used by all other packages. It is bundled along with some packages (e.g. API) or simply used in the build process to configure environments (e.g. app/web).

Most values in this package should not change often, but as usual, your local files are mounted as a volume, so you can modify code directly and the running containers will be updated immediately. However, compiled frontend packages will need to be re-compiled to see changes due to the way they bundle environment variables. Follow the steps in the [app](../app/README.md) and/or [web](../web/README.md) READMEs to recompile after changes.

**Note:** Follow standard practices when using this config package and do not include any secret values directly in the code. Utilize the `env` helper and extract secrets from environment variables rather than saving them directly in the source. Environment variables can be exported in your shell/environment or supplied via `.env` and `.env.[environment]` files as needed.

## Configuration

As usual, the development environment should work out of the box with no additional configuration required, but some secrets may be required for production and staging environments.

### Environment Variables

| Environment Var Name | Config Name            | Description                                                 | Default           | Notes                                                                  |
| -------------------- | ---------------------- | ----------------------------------------------------------- | ----------------- | ---------------------------------------------------------------------- |
| `APP_VERSION`        | `sentry.release`       | Sentry release identifier                                   |                   | **Required!** Should be supplied to Docker builds and frontend builds. |
| `SENTRY_AUTH_TOKEN`  | `sentry.token`         | Sentry authentication token (e.g. for uploading sourcemaps) |                   | **Required in [app](../app/README.md) package**                        |
| `SENTRY_CSP`         | `sentry.[package].csp` | Sentry Content-Security-Policy reporting URL                |                   |                                                                        |
| `SENTRY_DSN`         | `sentry.[package].dsn` | Sentry DSN for submitting crash reports                     |                   |                                                                        |
| `SENTRY_ORG`         | `sentry.org`           | Sentry organization                                         | `disruptive-labs` |                                                                        |
| `API_URL`            | `urls.api`             | API package URL                                             |                   |                                                                        |
| `MAIL_URL`           | `urls.mail`            | Mail package assets URL                                     |                   |                                                                        |
| `WEB_URL`            | `urls.web`             | Web package URL                                             |                   |                                                                        |

## Testing

To run all tests and get coverage reports, simply run `yarn workspace @two/config test`.
