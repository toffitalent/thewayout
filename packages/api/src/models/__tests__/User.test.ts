import { fixtures, resetDb } from '@test';
import { User } from '../User';

describe('Models > User', () => {
  beforeEach(async () => {
    await resetDb();
  });

  test('automatically hashes password', async () => {
    const update = await User.query()
      .patch({ password: 'DLabs2018!' })
      .where('id', fixtures.user1.id)
      .returning('*')
      .first();

    expect(update!.password).toMatch(/^\$2[ayb]\$[0-9]{2}\$[A-Za-z0-9./]{53}$/);

    const insert = await User.query()
      .insert({
        firstName: 'Test',
        lastName: 'User',
        email: 'test@dlabs.dev',
        password: 'DLabs2018!',
      })
      .returning('*');

    expect(insert.password).toMatch(/^\$2[ayb]\$[0-9]{2}\$[A-Za-z0-9./]{53}$/);
  });

  test('throws on already hashed password', async () => {
    try {
      await User.query()
        .patch({
          password: '$2b$12$zU/g7vtuUjlolqxtV6u.2eKPLUGPA9cr10SBNhnkwo.tTsRnornZa',
        })
        .where('id', fixtures.user1.id);

      throw new Error('test failed');
    } catch (err: any) {
      expect(err).toBeInstanceOf(Error);
      expect(err.message).toBe('Password property already contains Bcrypt hash');
    }
  });

  describe('name', () => {
    test("returns the user's full name", async () => {
      const user = await User.query().findById(fixtures.user1.id);
      expect(user!.name).toBe(`${fixtures.user1.firstName} ${fixtures.user1.lastName}`);
    });
  });

  describe('verifyPassword()', () => {
    test("validates the user's password", async () => {
      const user = await User.query().findById(fixtures.user1.id);
      const verify = await user!.verifyPassword('DLabs2018!');
      expect(verify).toBe(true);
    });

    test('returns false for users without a password', async () => {
      const [user] = await User.query()
        // @ts-ignore
        .patch({ password: null })
        .where('id', fixtures.user1.id)
        .returning('*');

      const verify = await user.verifyPassword('DLabs2018!');
      expect(verify).toBe(false);
    });
  });
});
