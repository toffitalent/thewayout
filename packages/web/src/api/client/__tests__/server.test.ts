import { client } from '../server';

describe('API > Client (Server)', () => {
  test('exports placeholder object', async () => {
    expect(client).toEqual({});
  });
});
