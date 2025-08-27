import { RspRole, UserType } from '@two/shared';
import { mockState, render, waitFor } from '@test';
import { AccountSettingsPage } from '../AccountSettingsPage';

describe('AccountSettingsPage', () => {
  test('renders correctly', async () => {
    const { container, findByText, queryByRole } = render(<AccountSettingsPage />, {
      initialState: {
        ...mockState,
        auth: {
          user: { rspAccount: { rsp: { name: 'Test' }, role: RspRole.owner }, type: UserType.Rsp },
        },
      },
    });
    await waitFor(async () => expect(await findByText('Account Settings')).toBeInTheDocument());
    expect(queryByRole('tab', { name: 'Account' })).toBeInTheDocument();
    expect(queryByRole('tab', { name: 'Organization' })).toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });

  test('hides Organization tab for member', async () => {
    const { findByText, queryByRole } = render(<AccountSettingsPage />, {
      initialState: {
        ...mockState,
        auth: {
          user: { rspAccount: { rsp: { name: 'Test' }, role: RspRole.member }, type: UserType.Rsp },
        },
      },
    });
    await waitFor(async () => expect(await findByText('Account Settings')).toBeInTheDocument());
    expect(queryByRole('tab', { name: 'Account' })).toBeInTheDocument();
    expect(queryByRole('tab', { name: 'Organization' })).not.toBeInTheDocument();
  });
});
