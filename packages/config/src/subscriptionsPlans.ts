import { register } from '@disruptive-labs/config';

export const subscriptionsPlans = register('subscriptionsPlans', () => ({
  free: {
    jobs: 1,
    uncloak: 3,
  },
}));
