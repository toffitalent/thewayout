import config from '@two/config';
import { renderTemplate } from '@test';
import { JobApplicationClient } from '..';

describe('JobApplicationClient', () => {
  const context = {
    client: {
      firstName: 'Test',
    },
    offerTitle: 'Test Job Title',
  };

  const email = new JobApplicationClient(context);

  test('augments dashboard page url context', () => {
    expect(email.getContext()).toEqual({
      ...context,
      config,
      dashboardPageUrl: `${config.get('urls.web')}/client/`,
    });
  });

  test('renders correctly', async () => {
    expect(await email.render()).toMatchSnapshot();
    expect(renderTemplate('JobApplicationClient', 'html', email.getContext())).toMatchSnapshot();
    expect(renderTemplate('JobApplicationClient', 'subject', email.getContext())).toMatchSnapshot();
    expect(renderTemplate('JobApplicationClient', 'text', email.getContext())).toMatchSnapshot();
  });
});
