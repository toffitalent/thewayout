import { useRouter } from 'next/router';
import { RspRole, UserType } from '@two/shared';
import { mockState, render, waitFor } from '@test';
import { RspSidebar } from '../RspSidebar';

describe('RspSidebar', () => {
  beforeEach(() => {
    (useRouter as jest.Mock).mockImplementation(() => ({
      asPath: '/',
    }));
  });

  test('renders correctly', async () => {
    const { container, findByText } = render(<RspSidebar />, {
      initialState: {
        ...mockState,
        auth: {
          user: { rspAccount: { rsp: { name: 'Test' }, role: RspRole.owner }, type: UserType.Rsp },
        },
      },
    });

    await waitFor(async () => expect(await findByText('Case Managers')).toBeInTheDocument());
    await waitFor(async () => expect(await findByText('Clients')).toBeInTheDocument());
    expect(container).toMatchSnapshot();
  });

  test('hides Case Managers tab for members', async () => {
    const { findByText, queryByText } = render(<RspSidebar />, {
      initialState: {
        ...mockState,
        auth: {
          user: { rspAccount: { rsp: { name: 'Test' }, role: RspRole.member }, type: UserType.Rsp },
        },
      },
    });

    await waitFor(async () => expect(await findByText('Clients')).toBeInTheDocument());
    expect(queryByText('Case Managers')).not.toBeInTheDocument();
    expect(queryByText('Reports')).not.toBeInTheDocument();
  });
});
