import { fixtures } from '@test';
import { client } from '../client';
import { job } from '../job';

jest.mock('../client');

describe('API > Job', () => {
  test('executes create job request', async () => {
    (client.post as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({ data: fixtures.job }),
    );

    const res = await job.create(fixtures.job);
    expect(res).toBe(fixtures.job);
  });

  test('executes list jobs request', async () => {
    (client.get as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({ data: [fixtures.job], headers: { 'x-total-count': '2' } }),
    );

    const res = await job.list({});
    expect(res).toEqual({ data: [fixtures.job], total: 2 });
  });

  test('executes retrieve job request', async () => {
    (client.get as jest.Mock).mockImplementationOnce(() => Promise.resolve({ data: fixtures.job }));

    const res = await job.retrieve(fixtures.job.id, {});
    expect(res).toBe(fixtures.job);
  });

  test('executes apply job request', async () => {
    (client.post as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({ data: fixtures.job }),
    );

    const res = await job.apply(fixtures.job.id, {});
    expect(res).toBe(fixtures.job);
  });

  test('executes update job request', async () => {
    (client.patch as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({ data: fixtures.job }),
    );

    const res = await job.update(fixtures.job.id, { title: 'Test' });
    expect(res).toBe(fixtures.job);
  });
});
