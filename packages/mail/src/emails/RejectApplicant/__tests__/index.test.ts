import config from '@two/config';
import { renderTemplate } from '@test';
import { RejectApplicant } from '..';

describe('RejectApplicant', () => {
  const context = {
    client: {
      firstName: 'Test',
    },
    offerTitle: 'Test Job Title',
  };

  const email = new RejectApplicant(context);

  test('augments dashboard page url context', () => {
    expect(email.getContext()).toEqual({
      ...context,
      config,
      dashboardPageUrl: `${config.get('urls.web')}/client/`,
    });
  });

  test('renders correctly', async () => {
    expect(await email.render()).toMatchSnapshot();
    expect(renderTemplate('RejectApplicant', 'html', email.getContext())).toMatchSnapshot();
    expect(renderTemplate('RejectApplicant', 'subject', email.getContext())).toMatchSnapshot();
    expect(renderTemplate('RejectApplicant', 'text', email.getContext())).toMatchSnapshot();
  });
});
