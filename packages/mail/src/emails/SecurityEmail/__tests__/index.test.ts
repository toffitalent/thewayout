import { renderTemplate } from '@test';
import { SecurityEmail } from '..';

describe('SecurityEmail', () => {
  const context = {
    user: {
      firstName: 'Test',
    },
  };

  const email = new SecurityEmail(context);

  test('renders correctly', async () => {
    expect(await email.render()).toMatchSnapshot();
    expect(renderTemplate('SecurityEmail', 'html', context)).toMatchSnapshot();
    expect(renderTemplate('SecurityEmail', 'subject', context)).toMatchSnapshot();
    expect(renderTemplate('SecurityEmail', 'text', context)).toMatchSnapshot();
  });
});
