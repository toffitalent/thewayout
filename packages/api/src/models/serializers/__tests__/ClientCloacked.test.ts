import { Client } from '@app/models/Client';
import { fixtures } from '@test';
import { ClientCloakedSerializer } from '../ClientCloaked';

describe('ClientCloakedSerializer', () => {
  test('displays cloaked information', async () => {
    const cloakedClient = await Client.query()
      .findById(fixtures.clientProfile1.id)
      .throwIfNotFound();
    const serializer = new ClientCloakedSerializer();

    const serialized = await serializer.serialize(cloakedClient);

    expect(serialized).toMatchSnapshot({ id: expect.any(String) });
  });
});
