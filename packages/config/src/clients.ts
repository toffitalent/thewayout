import { env, register } from '@disruptive-labs/config';

/**
 * NOTE: DO NOT PUT SECRETS IN THIS FILE!!!
 *
 * Client configuration values are embedded in client-side app and web products and can be easily
 * extracted. Any values configured here should be "exposable".
 *
 * The "secret" keys below are client tokens used for the OAuth token process. They merely serve as
 * an escape-hatch in case we need to cut off old clients.
 */
export const clients = register('clients', () => ({
  web: {
    id: '00afc736-b9d2-11ec-b7bf-d3b5ee15ea0b',
    secret: env({
      default: 'T2t4WbCBhaX7n7rjFqjOjnstzcHckKh6qNTn2maM/Z8=',
      staging: 'CaaYnc5o4o3xLWk/J4u2H9zJQCcmZSDcwEykPiJ3+Og=',
      production: 'MV2NHW/DOAq6sqvk2UeawkuaE1FoHy6tLNjuBFg1o0w=',
    }),
  },
}));
