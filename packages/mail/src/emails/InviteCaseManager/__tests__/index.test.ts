import config from '@two/config';
import { renderTemplate } from '@test';
import { InviteCaseManager } from '..';

describe('InviteCaseManager', () => {
  const context = {
    firstName: 'First',
    lastName: 'Last',
    email: 'test@test.com',
    phone: '1112223333',
    invitationId: 'INVITATION_TEST_ID',
    rspName: 'Organization Name',
  };

  const email = new InviteCaseManager(context);

  test('augments invitation url context', () => {
    expect(email.getContext()).toEqual({
      ...context,
      config,
      url: `${config.get(
        'urls.web',
      )}/ssp/signup/?firstName=First&lastName=Last&email=test%40test.com&phone=1112223333&invitationId=INVITATION_TEST_ID&rspName=Organization%20Name`,
    });
  });

  test('renders correctly', async () => {
    expect(await email.render()).toMatchSnapshot();
    expect(renderTemplate('InviteCaseManager', 'html', email.getContext())).toMatchSnapshot();
    expect(renderTemplate('InviteCaseManager', 'subject', email.getContext())).toMatchSnapshot();
    expect(renderTemplate('InviteCaseManager', 'text', email.getContext())).toMatchSnapshot();
  });
});
