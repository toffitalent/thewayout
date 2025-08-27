import config from '@two/config';
import { Email } from '../Email';

interface TestContext {
  test: boolean;
}

const html = jest.fn().mockReturnValue('');
const text = jest.fn().mockReturnValue('');
const subject = jest.fn().mockReturnValue('');

class TestEmail extends Email<TestContext> {
  html = html;
  text = text;
  subject = subject;
}

describe('Email', () => {
  const context = { test: true };

  test('getContext() returns email context with config', () => {
    const email = new TestEmail(context);
    expect(email.getContext()).toEqual({
      config,
      test: true,
    });
  });

  test('render() calls html, text, and subject methods', async () => {
    const email = new TestEmail(context);
    expect(await email.render()).toEqual({
      html: '',
      subject: '',
      text: '',
    });

    expect(html).toBeCalled();
    expect(text).toBeCalled();
    expect(subject).toBeCalled();
  });
});
