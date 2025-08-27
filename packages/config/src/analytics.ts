import { env, register } from '@disruptive-labs/config';

export const analytics = register('analytics', () => ({
  segment: {
    // Packages
    api: env({
      default: '',
      // staging: '',
      // production: '',
    }),
    app: env({
      default: '',
      // staging: '',
      // production: '',
    }),
    web: env({
      default: '',
      // staging: '',
      // production: '',
    }),
  },
}));
