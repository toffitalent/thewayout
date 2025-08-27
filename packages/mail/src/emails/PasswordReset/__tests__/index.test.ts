import config from '@two/config';
import { renderTemplate } from '@test';
import { PasswordReset } from '..';

describe('PasswordReset', () => {
  const context = {
    token: '__TOKEN__',
    user: {
      firstName: 'Test',
      username: 'test@example.com',
    },
  };

  const email = new PasswordReset(context);

  test('augments email context', () => {
    expect(email.getContext()).toEqual({
      ...context,
      config,
      url: `${config.get('urls.web')}/reset-password/?token=__TOKEN__&username=test%40example.com`,
    });
  });

  test('renders correctly', async () => {
    expect(await email.render()).toMatchSnapshot();
    expect(renderTemplate('PasswordReset', 'html', context)).toMatchSnapshot();
    expect(renderTemplate('PasswordReset', 'subject', context)).toMatchSnapshot();
    expect(renderTemplate('PasswordReset', 'text', context)).toMatchSnapshot();
  });
});
