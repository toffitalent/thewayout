import type { Consumer } from 'sqs-consumer';
import config from '@two/config';

describe('app', () => {
  let captureException: any;
  let Consumer: Consumer;
  let on: jest.Mock;
  let start: jest.Mock;
  let getTransport: any;
  let handleError: any;
  let handleMessage: any;
  let isEmailMessage: any;
  let transport: any;

  beforeEach(() => {
    (global as any).__webpack_public_path__ = undefined;

    jest.isolateModules(() => {
      ({ captureException } = require('@sentry/node'));
      ({ Consumer, on, start } = require('sqs-consumer'));
      ({ getTransport, handleError, handleMessage, isEmailMessage, transport } = require('../app'));
    });
  });

  afterEach(() => {
    delete (global as any).__webpack_public_path__;
  });

  test('starts consumer', () => {
    expect(Consumer).toBeCalledTimes(1);
    expect(Consumer).toBeCalledWith({
      queueUrl: config.get('mail.queue.url'),
      handleMessage,
      sqs: expect.any(Object),
    });
    expect(on).toBeCalledTimes(2);
    expect(on).toBeCalledWith('error', handleError);
    expect(on).toBeCalledWith('processing_error', handleError);
    expect(start).toBeCalledTimes(1);
  });

  test('utilizes the configured transport', () => {
    expect(getTransport('ses').transporter.name).toBe('SESTransport');
    expect(getTransport('smtp').transporter.name).toBe('SMTP');
    expect(getTransport('').transporter.name).toBe('JSONTransport');
  });

  test('validates email queue messages', () => {
    expect(isEmailMessage(undefined)).toBe(false);
    expect(isEmailMessage(null)).toBe(false);
    expect(isEmailMessage({})).toBe(false);
    expect(isEmailMessage({ template: 'unknown' })).toBe(false);
    expect(isEmailMessage({ template: 'Welcome' })).toBe(false);
    expect(isEmailMessage({ template: 'Welcome', to: 'test@example.com' })).toBe(true);
  });

  test('renders and sends emails', async () => {
    const spy = jest.spyOn(transport, 'sendMail');
    await handleMessage({
      Body: JSON.stringify({
        template: 'Welcome',
        context: { user: { firstName: 'Test' } },
        to: 'test@example.com',
      }),
    });

    expect(spy).toBeCalledTimes(1);
    expect(spy).toBeCalledWith({
      from: {
        address: config.get('company.emailFromAddress'),
        name: config.get('company.emailFromName'),
      },
      html: expect.any(String),
      text: expect.any(String),
      subject: expect.any(String),
      to: 'test@example.com',
    });
  });

  test('logs errors to Sentry', () => {
    const error = new Error('test');
    handleError(error);
    expect(captureException).toBeCalledTimes(1);
    expect(captureException).toBeCalledWith(error, { contexts: { message: { body: '', id: '' } } });
  });

  test('adds queue message context to Sentry error if available', () => {
    const error = new Error('test');
    handleError(error, { Body: '{}', MessageId: '12345' });
    expect(captureException).toBeCalledTimes(1);
    expect(captureException).toBeCalledWith(error, {
      contexts: { message: { body: '{}', id: '12345' } },
    });
  });
});
