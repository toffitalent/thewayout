import { JusticeStatus } from '@two/shared';
import { renderTemplate } from '@test';
import { RspApplicationSupport } from '..';

describe('RspApplicationSupport', () => {
  test('renders correctly', async () => {
    const context = {
      user: {
        name: 'Test Name',
        address: '459 S Hewitt St, 90255 Los Angeles, CA',
        email: 'test@test.com',
        phone: '(414) 213-3945',
        support: 'Support',
        offense: 'Offense',
      },
      rsp: {
        caseManagerFirstName: 'Test',
        name: 'My Way Out',
      },
    };

    const email = new RspApplicationSupport(context);

    expect(await email.render()).toMatchSnapshot();
    expect(renderTemplate('RspApplicationSupport', 'html', context)).toMatchSnapshot();
    expect(renderTemplate('RspApplicationSupport', 'subject', context)).toMatchSnapshot();
    expect(renderTemplate('RspApplicationSupport', 'text', context)).toMatchSnapshot();
  });

  test('renders correctly for "Currently Incarcerated" client', async () => {
    const context = {
      user: {
        name: 'Test Name',
        address: '459 S Hewitt St, 90255 Los Angeles, CA',
        email: 'test@test.com',
        phone: '(414) 213-3945',
        support: 'Support',
        offense: 'Offense',
        justiceStatus: JusticeStatus.currentlyIncarcerated,
        facility: 'Test',
        expectedReleasedAt: '2023-10-19',
      },
      rsp: {
        caseManagerFirstName: 'Test',
        name: 'My Way Out',
      },
    };
    const email = new RspApplicationSupport(context);

    expect(await email.render()).toMatchSnapshot();
    expect(renderTemplate('RspApplicationSupport', 'html', email.getContext())).toMatchSnapshot();
    expect(
      renderTemplate('RspApplicationSupport', 'subject', email.getContext()),
    ).toMatchSnapshot();
    expect(renderTemplate('RspApplicationSupport', 'text', email.getContext())).toMatchSnapshot();
  });
});
