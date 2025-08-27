async function runWorker(...args: string[]) {
  process.argv = ['node', 'worker.js', ...args];
  return require('../worker');
}

describe('Worker', () => {
  let originalArgv: any;

  beforeEach(() => {
    jest.resetModules();
    originalArgv = process.argv;
  });

  afterEach(() => {
    process.argv = originalArgv;
  });

  test('starts worker with default/no command', async () => {
    jest.mock('../tasks');
    const { Consumer, on, start, stop } = require('sqs-consumer');
    const { Sentry } = require('@app/services/Sentry');

    runWorker();
    expect(on).toBeCalledTimes(2);
    expect(start).toBeCalled();

    process.emit('SIGINT');
    expect(stop).toBeCalledWith({ abort: true });

    process.emit('SIGTERM');
    expect(stop).toBeCalledTimes(2);

    // Processes messages
    const { DummyExampleTask } = require('../tasks');
    Consumer.mock.calls[0][0].handleMessage({
      Body: '{"task":"dummy_example","payload":{"id":"test-id"}}',
    });
    expect(DummyExampleTask).toBeCalledWith({ id: 'test-id' });

    // Logs errors
    const captureException = jest.spyOn(Sentry, 'captureException');
    const error = new Error();
    on.mock.calls[0][1](error);
    expect(captureException).toBeCalledWith(error, { contexts: { message: { body: '', id: '' } } });
  });

  describe('run', () => {
    test('runs specified task with payload', async () => {
      jest.mock('../db');
      jest.mock('../tasks');
      const { DummyExampleTask } = require('../tasks');
      const { knex } = require('../db');

      runWorker('run', 'dummy_example', '--payload', `{"id":"test-id"}`);
      await new Promise(process.nextTick);
      expect(DummyExampleTask).toBeCalledWith({ id: 'test-id' });
      expect(knex.destroy).toBeCalled();
    });

    test('runs specified task with supplied params', async () => {
      jest.mock('../db');
      jest.mock('../tasks');
      const { DummyExampleTask } = require('../tasks');
      runWorker('run', 'dummy_example', '--id', 'test-id');
      await new Promise(process.nextTick);
      expect(DummyExampleTask).toBeCalledWith({ id: 'test-id' });
    });
  });
});
