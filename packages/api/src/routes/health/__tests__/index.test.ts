import { request } from '@test';

describe('Routes > Health', () => {
  describe('GET /api/v1/health', () => {
    test('returns a 2XX response code', async () => {
      const res = await request().get('/api/v1/health');
      expect(res.status).toBe(204);
    });
  });
});
