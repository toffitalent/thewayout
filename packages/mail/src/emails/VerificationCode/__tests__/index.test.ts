import { renderTemplate } from '@test';
import { VerificationCode } from '..';

describe('VerificationCode', () => {
  const context = {
    code: '123456',
    user: {
      firstName: 'Test',
    },
  };

  const email = new VerificationCode(context);

  test('renders correctly', async () => {
    expect(await email.render()).toMatchSnapshot();
    expect(renderTemplate('VerificationCode', 'html', context)).toMatchSnapshot();
    expect(renderTemplate('VerificationCode', 'subject', context)).toMatchSnapshot();
    expect(renderTemplate('VerificationCode', 'text', context)).toMatchSnapshot();
  });
});
