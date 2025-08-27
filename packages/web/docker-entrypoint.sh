#!/bin/sh
set -o errexit
set -o pipefail
set -u

APP_ENV=${APP_ENV:="production"}

exec ./node_modules/.bin/env-run -e $APP_ENV "$@"
