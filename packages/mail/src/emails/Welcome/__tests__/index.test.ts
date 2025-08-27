import { renderTemplate } from '@test';
import { Welcome } from '..';

describe('Welcome', () => {
  const context = {
    user: {
      firstName: 'Test',
    },
  };

  const email = new Welcome(context);

  test('renders correctly', async () => {
    expect(await email.render()).toMatchSnapshot();
    expect(renderTemplate('Welcome', 'html', context)).toMatchSnapshot();
    expect(renderTemplate('Welcome', 'subject', context)).toMatchSnapshot();
    expect(renderTemplate('Welcome', 'text', context)).toMatchSnapshot();
  });
});
