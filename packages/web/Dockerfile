# syntax=docker/dockerfile:1.3

FROM node:18.16-alpine as base

ARG NODE_ENV
ENV NODE_ENV=${NODE_ENV:-production}
ENV NEXT_TELEMETRY_DISABLED=1

USER node
WORKDIR /app

FROM base as builder

ARG NPM_TOKEN
ARG APP_ENV=${APP_ENV:-production}
ARG VERSION=${VERSION:-dev}

# Install dependencies
COPY --chown=node:node .npmrc package.json yarn.lock tsconfig.json wait-for ./
COPY --chown=node:node packages/config/package.json ./packages/config/
COPY --chown=node:node packages/shared/package.json ./packages/shared/
COPY --chown=node:node packages/web/package.json ./packages/web/

RUN --mount=type=secret,id=NPM_TOKEN,uid=1000 NPM_TOKEN=$(cat /run/secrets/NPM_TOKEN || echo $NPM_TOKEN) sh -c 'yarn install --frozen-lockfile --production=false'
RUN rm .npmrc

# Copy source
COPY --chown=node:node packages/config ./packages/config/
COPY --chown=node:node packages/shared ./packages/shared/
COPY --chown=node:node packages/web ./packages/web/

# Build package
# NOTE: This is an environment-specific build based on APP_ENV, which breaks
# the build once, run anywhere mantra. Consider improvements in the future.
RUN --mount=type=secret,id=SENTRY_AUTH_TOKEN,uid=1000 SENTRY_AUTH_TOKEN=$(cat /run/secrets/SENTRY_AUTH_TOKEN || echo "") APP_VERSION="$VERSION" sh -c "yarn workspace @two/config build && yarn workspace @two/shared build && yarn workspace @two/web build:$APP_ENV"

# Remove unnecessary files
RUN rm -r /app/packages/config/src
RUN rm -r /app/packages/shared/src
RUN rm -r /app/packages/web/src

# Reinstall packages based on NODE_ENV
RUN yarn install --frozen-lockfile --offline


FROM base as web

# Copy dependencies & compiled source
COPY --from=builder --chown=node:node /app ./

# Configure entrypoint
COPY packages/web/docker-entrypoint.sh /usr/local/bin/
ENTRYPOINT ["docker-entrypoint.sh"]

WORKDIR /app/packages/web

# Configure environment variables
ARG APP_ENV
ARG VERSION
ENV APP_ENV=${APP_ENV:-production}
ENV APP_VERSION=${VERSION:-dev}

CMD ["yarn", "start"]
