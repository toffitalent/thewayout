# syntax=docker/dockerfile:1.3

FROM node:18.16-alpine as base

ARG NODE_ENV
ENV NODE_ENV=${NODE_ENV:-production}

USER node
WORKDIR /app


FROM base as builder

ARG NPM_TOKEN

# Install dependencies
COPY --chown=node:node .npmrc package.json yarn.lock tsconfig.json wait-for ./
COPY --chown=node:node packages/config/package.json ./packages/config/
COPY --chown=node:node packages/mail/package.json ./packages/mail/
COPY --chown=node:node packages/shared/package.json ./packages/shared/

RUN --mount=type=secret,id=NPM_TOKEN,uid=1000 NPM_TOKEN=$(cat /run/secrets/NPM_TOKEN || echo $NPM_TOKEN) sh -c 'yarn install --frozen-lockfile --production=false'
RUN rm .npmrc

# Copy source
COPY --chown=node:node packages/config ./packages/config/
COPY --chown=node:node packages/mail ./packages/mail/
COPY --chown=node:node packages/shared ./packages/shared/

# Build package
RUN yarn workspace @two/mail build:app

# Remove unnecessary files
RUN rm -r /app/packages/config/src
RUN rm -r /app/packages/mail/src
RUN rm -r /app/packages/shared/src/components

# Reinstall packages based on NODE_ENV
RUN yarn install --frozen-lockfile --offline


FROM base as mail

# Copy dependencies & compiled source
COPY --from=builder --chown=node:node /app ./

WORKDIR /app/packages/mail

# Configure environment variables
ARG VERSION
ENV APP_VERSION=${VERSION:-dev}

CMD [ "yarn", "run", "start" ]
