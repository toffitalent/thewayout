import { OffenseCategory, ReleasedAt, StateFederal, TimeServed } from '@two/shared';
import { fixtures, resetDb } from '@test';
import { Client, ClientSerializer } from '../..';

const getCtx = (admin?: boolean, self?: boolean) => ({
  auth: { is: () => !!self, has: () => !!admin },
});

describe('ClientSerializer', () => {
  beforeEach(async () => {
    await resetDb();
  });

  const offenseInformation = {
    offense: [OffenseCategory.arson],
    sexualOffenderRegistry: true,
    sbn: true,
    timeServed: TimeServed.timeServed01,
    releasedAt: ReleasedAt.releasedAt01,
    stateOrFederal: StateFederal.state,
  };

  test('only displays offense information to self or admins', async () => {
    const client = await Client.query()
      .insert({
        ...offenseInformation,
        userId: fixtures.user1.id,
        relativeExperience: [],
        education: [],
      })
      .returning('*');
    const serializer = new ClientSerializer();

    const serialized = await serializer.serialize(client);
    expect(serialized).toEqual(expect.not.objectContaining(offenseInformation));
    expect(serialized).toMatchSnapshot({ id: expect.any(String) });

    const serializedSelf = await serializer.serialize(client, { ctx: getCtx(false, true) });
    expect(serializedSelf).toEqual(expect.objectContaining(offenseInformation));
    expect(serializedSelf).toMatchSnapshot({ id: expect.any(String) });

    const serializedAdmin = await serializer.serialize(client, { ctx: getCtx(true, false) });
    expect(serializedAdmin).toEqual(expect.objectContaining(offenseInformation));
    expect(serializedAdmin).toMatchSnapshot({ id: expect.any(String) });
  });
});
