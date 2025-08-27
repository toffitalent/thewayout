import config from '@two/config';
import { renderTemplate } from '@test';
import { HireApplicant } from '..';

describe('HireApplicant', () => {
  const context = {
    client: {
      firstName: 'Test',
    },
    company: {
      name: 'Test',
    },
    offerTitle: 'Test Job Title',
  };

  const email = new HireApplicant(context);

  test('augments dashboard page url context', () => {
    expect(email.getContext()).toEqual({
      ...context,
      config,
      dashboardPageUrl: `${config.get('urls.web')}/client/`,
    });
  });

  test('renders correctly', async () => {
    expect(await email.render()).toMatchSnapshot();
    expect(renderTemplate('HireApplicant', 'html', email.getContext())).toMatchSnapshot();
    expect(renderTemplate('HireApplicant', 'subject', email.getContext())).toMatchSnapshot();
    expect(renderTemplate('HireApplicant', 'text', email.getContext())).toMatchSnapshot();
  });
});
