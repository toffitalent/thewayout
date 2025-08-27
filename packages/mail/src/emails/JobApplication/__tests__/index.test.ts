import config from '@two/config';
import { renderTemplate } from '@test';
import { JobApplication } from '..';

describe('JobApplication', () => {
  const context = {
    employer: {
      firstName: 'Test',
    },
    offerTitle: 'Test Job Title',
  };

  const email = new JobApplication(context);

  test('augments dashboard page url context', () => {
    expect(email.getContext()).toEqual({
      ...context,
      config,
      dashboardPageUrl: `${config.get('urls.web')}/employer/`,
    });
  });

  test('renders correctly', async () => {
    expect(await email.render()).toMatchSnapshot();
    expect(renderTemplate('JobApplication', 'html', email.getContext())).toMatchSnapshot();
    expect(renderTemplate('JobApplication', 'subject', email.getContext())).toMatchSnapshot();
    expect(renderTemplate('JobApplication', 'text', email.getContext())).toMatchSnapshot();
  });
});
