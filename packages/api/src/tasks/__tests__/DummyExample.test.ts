import { faker } from '@faker-js/faker';
import { fixtures, resetDb } from '@test';
import { DummyExampleTask } from '../DummyExample';

describe('Tasks > DummyExampleTask', () => {
  beforeEach(async () => {
    await resetDb();
    faker.seed(1);
  });

  test('sends push notification to sender', async () => {
    const spy = jest.spyOn(console, 'log').mockImplementationOnce(() => {});

    const task = new DummyExampleTask({ id: fixtures.user1.id });
    await task.handle();
    expect(spy).toBeCalledTimes(1);
    expect(spy).toBeCalledWith(
      `Task invoked with user: ${fixtures.user1.firstName} ${fixtures.user1.lastName}`,
    );
  });
});
