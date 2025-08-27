import { fixtures, resetDb } from '@test';
import { User } from '../..';
import { UserSerializer } from '../User';

const getCtx = (admin?: boolean, self?: boolean) => ({
  auth: { is: () => !!self, has: () => !!admin },
});

describe('UserSerializer', () => {
  beforeEach(async () => {
    await resetDb();
  });

  test('only displays email property to self or admins', async () => {
    const user = await User.query().findById(fixtures.user1.id).throwIfNotFound();
    const serializer = new UserSerializer();
    const serialized = await serializer.serialize(user);
    expect(serialized).not.toHaveProperty('email');
    expect(serialized).toMatchSnapshot();
    expect(await serializer.serialize(user, { ctx: getCtx(false, true) })).toMatchSnapshot();
    expect(await serializer.serialize(user, { ctx: getCtx(true, false) })).toMatchSnapshot();
  });

  test('only displays roles property to admins', async () => {
    const user = await User.query().findById(fixtures.user1.id).throwIfNotFound();
    const serializer = new UserSerializer();
    expect(await serializer.serialize(user)).toMatchSnapshot();
    expect(await serializer.serialize(user, { ctx: getCtx(true) })).toMatchSnapshot();
  });
});
