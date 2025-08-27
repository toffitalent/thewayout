import { User } from '@app/models';
import { fixtures } from '@test';
import { serializePayload } from '../utils';

describe('Tasks > Utils', () => {
  describe('serializePayload()', () => {
    test('serializes payloads', () => {
      expect(serializePayload({ id: 'test', key: 'value' })).toEqual({ id: 'test', key: 'value' });
      expect(serializePayload('test' as any)).toEqual('test');
      expect(serializePayload({ id: 'test', obj: { key: 'value' } })).toEqual({
        id: 'test',
        obj: { key: 'value' },
      });
      expect(serializePayload([{ id: 'test' }])).toEqual([{ id: 'test' }]);
    });

    test('serializes objection models', async () => {
      const user = await User.query().findById(fixtures.user1.id).throwIfNotFound();

      expect(serializePayload(user)).toEqual({ id: user.id });
      expect(serializePayload([user])).toEqual([{ id: user.id }]);
      expect(serializePayload({ id: 'test', user })).toEqual({ id: 'test', user: { id: user.id } });
    });
  });
});
