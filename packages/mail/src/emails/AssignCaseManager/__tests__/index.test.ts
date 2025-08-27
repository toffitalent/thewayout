import config from '@two/config';
import { renderTemplate } from '@test';
import { AssignCaseManager } from '..';

describe('AssignCaseManager', () => {
  const context = {
    firstName: 'Heidi',
    rspName: 'Organization Name',
    rspClientId: 'RSP_CLIENT_ID',
    client: { firstName: 'Annetta', lastName: 'Robel' },
  };

  const email = new AssignCaseManager(context);

  test('augments client url context', () => {
    expect(email.getContext()).toEqual({
      ...context,
      config,
      url: `${config.get('urls.web')}/ssp/clients/RSP_CLIENT_ID/`,
    });
  });

  test('renders correctly', async () => {
    expect(await email.render()).toMatchSnapshot();
    expect(renderTemplate('AssignCaseManager', 'html', email.getContext())).toMatchSnapshot();
    expect(renderTemplate('AssignCaseManager', 'subject', email.getContext())).toMatchSnapshot();
    expect(renderTemplate('AssignCaseManager', 'text', email.getContext())).toMatchSnapshot();
  });
});
