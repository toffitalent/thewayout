import './config';

import { App, Config as AppConfig, Context } from '@disruptive-labs/server';
import config from '@two/config';
import { router } from '@app/routes';
import { onError } from '@app/services/Sentry';

const app = new App(config.get<AppConfig>('api.server'));

/* istanbul ignore next */
app.on('error', (error: Error, ctx?: Context) => {
  if (config.environment('staging', 'production')) {
    onError(error, ctx);
    return;
  }

  // eslint-disable-next-line no-console
  console.error(error);
});

/* istanbul ignore next */
app.on('stopped', () => {
  process.exit();
});

app.mount(router);

/* istanbul ignore if: avoid starting server if module imported for tests */
if (require.main === module) {
  process.on('SIGINT', () => app.stop());
  process.on('SIGTERM', () => app.stop());

  app.start();
}

export { app };
