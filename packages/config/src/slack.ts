import { env, register } from '@disruptive-labs/config';

export const slack = register('slack', () => ({
  alerts: env({
    staging: 'https://hooks.slack.com/services/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',
    production: 'https://hooks.slack.com/services/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',
  }),
}));
