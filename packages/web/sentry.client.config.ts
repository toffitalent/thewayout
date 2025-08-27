import {
  Breadcrumbs,
  BrowserClient,
  Dedupe,
  defaultStackParser,
  getCurrentHub,
  GlobalHandlers,
  LinkedErrors,
  makeFetchTransport,
} from '@sentry/browser';

const client = new BrowserClient({
  dsn: process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 0,
  transport: makeFetchTransport,
  stackParser: defaultStackParser,
  integrations: [new Breadcrumbs(), new GlobalHandlers(), new LinkedErrors(), new Dedupe()],
});

getCurrentHub().bindClient(client);
