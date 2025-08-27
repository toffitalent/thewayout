# @two/web

Copyright (c) 2023-Present The Way Out, Inc. All Rights Reserved.

## Development

Assuming you've previously followed the commands in the root [README](../../README.md), fire up the app for development by running the following commands from the monorepo root:

```shell
# Launch dev mode
yarn workspace @two/web dev
```

This will launch the NextJS bundler in development mode, which will automatically recompile code changes and update the app running in the browser.

_Note:_: If connecting to the API, make sure to [follow the steps](../api/README.md) to start the API containers before starting the web package.

## Environment

Out of the box, the web package supports 3 different environments: `development`, `staging`, and `production` - available using environment variables and package.json scripts. The default setup has everything configured out of the box and should be able to build and run without any additional configuration. To add additional environment variables to `process.env`, add them to `.env.js` or to an `.env.[environment]` file as appropriate. Remember to prefix them with `NEXT_PUBLIC_`, as required by NextJS. Also, as with any frontend client, these values are embedded in the code delivered to the user and able to be extracted. **DO NOT INCLUDE ANY SECRETS!**

## Testing

To run all component and unit tests and get coverage reports, simply run `yarn workspace @two/web test`.
