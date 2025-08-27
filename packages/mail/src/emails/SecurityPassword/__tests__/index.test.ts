import { renderTemplate } from '@test';
import { SecurityPassword } from '..';

describe('SecurityPassword', () => {
  const context = {
    user: {
      firstName: 'Test',
    },
  };

  const email = new SecurityPassword(context);

  test('renders correctly', async () => {
    expect(await email.render()).toMatchSnapshot();
    expect(renderTemplate('SecurityPassword', 'html', context)).toMatchSnapshot();
    expect(renderTemplate('SecurityPassword', 'subject', context)).toMatchSnapshot();
    expect(renderTemplate('SecurityPassword', 'text', context)).toMatchSnapshot();
  });
});
