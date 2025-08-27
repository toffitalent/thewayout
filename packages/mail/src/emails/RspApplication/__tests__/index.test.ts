import { renderTemplate } from '@test';
import { RspApplication } from '..';

describe('RspApplication', () => {
  const context = {
    user: {
      firstName: 'Test',
    },
    reentryServiceProvider: 'My Way Out',
  };

  const email = new RspApplication(context);

  test('renders correctly', async () => {
    expect(await email.render()).toMatchSnapshot();
    expect(renderTemplate('RspApplication', 'html', context)).toMatchSnapshot();
    expect(renderTemplate('RspApplication', 'subject', context)).toMatchSnapshot();
    expect(renderTemplate('RspApplication', 'text', context)).toMatchSnapshot();
  });
});
