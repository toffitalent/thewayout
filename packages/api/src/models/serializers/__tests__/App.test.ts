import { fixtures, resetDb } from '@test';
import { App } from '../..';
import { AppSerializer } from '../App';

const getCtx = (admin: boolean) => ({ auth: { has: () => admin } });

describe('AppSerializer', () => {
  beforeEach(async () => {
    await resetDb();
  });

  test('only displays userId property to admins', async () => {
    const app = await App.query().findById(fixtures.app.id).throwIfNotFound();
    const serializer = new AppSerializer();
    expect(await serializer.serialize(app)).toMatchSnapshot();
    expect(await serializer.serialize(app, { ctx: getCtx(true) })).toMatchSnapshot({
      id: expect.any(String),
    });
  });
});
