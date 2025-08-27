import userEvent from '@testing-library/user-event';
import { useRouter } from 'next/router';
import { RspClientStatus } from '@two/shared';
import { act, fixtures, MockedThunk, mockState, mockThunks, render } from '@test';
import * as actions from '../actions';
import { ClientPage } from '../ClientPage';

const { rspClient, rsp, rspAccountMember, rspAccountOwner } = fixtures;

describe('ClientPage', () => {
  let acceptClient: MockedThunk;
  let declineClient: MockedThunk;
  let assignCaseManager: MockedThunk;

  beforeEach(() => {
    (useRouter as jest.Mock).mockImplementation(() => ({
      query: { id: String(rspClient.id) },
    }));
    [acceptClient, declineClient, assignCaseManager] = mockThunks(actions, [
      'acceptClient',
      'declineClient',
      'assignCaseManager',
    ]);
  });

  test('renders correctly', async () => {
    const { container } = render(<ClientPage />, {
      initialState: {
        ...mockState,
        auth: {
          user: { rspAccount: rspAccountOwner },
        },
      },
    });
    expect(container).toMatchSnapshot();
  });

  test('shows buttons for client with pending status', async () => {
    const { queryByRole, findByRole } = render(<ClientPage />, {
      initialState: {
        ...mockState,
        auth: {
          user: { rspAccount: rspAccountOwner },
        },
      },
    });
    const acceptButton = await findByRole('button', { name: 'Accept' });
    const rejectButton = await findByRole('button', { name: 'Reject' });
    const select = queryByRole('combobox', { name: 'Case Manager' });

    expect(acceptButton).toBeInTheDocument();
    expect(rejectButton).toBeInTheDocument();
    expect(select).not.toBeInTheDocument();

    await act(() => userEvent.click(acceptButton));
    expect(acceptClient).toBeCalledWith({ rspId: rsp.id, clientId: rspClient.id });

    await act(() => userEvent.click(rejectButton));
    expect(declineClient).toBeCalledWith({ rspId: rsp.id, clientId: rspClient.id });
  });

  test('shows select for client with active status', async () => {
    const { queryByRole, findByRole } = render(<ClientPage />, {
      initialState: {
        ...mockState,
        auth: {
          user: { rspAccount: rspAccountOwner },
        },
        rsp: {
          ...mockState.rsp,
          client: { ...rspClient, status: RspClientStatus.active },
        },
      },
    });
    const acceptButton = queryByRole('button', { name: 'Accept' });
    const rejectButton = queryByRole('button', { name: 'Reject' });
    const select = await findByRole('combobox', { name: 'Case Manager' });

    expect(acceptButton).not.toBeInTheDocument();
    expect(rejectButton).not.toBeInTheDocument();
    expect(select).toBeInTheDocument();

    await act(() => userEvent.selectOptions(select, rspAccountMember.id));
    expect(assignCaseManager).toBeCalledWith({
      rspId: rsp.id,
      clientId: rspClient.id,
      caseManagerId: rspAccountMember.id,
    });
  });

  test('not shows select for case manager without owner role', async () => {
    const { queryByRole } = render(<ClientPage />, {
      initialState: {
        ...mockState,
        auth: {
          user: { rspAccount: rspAccountMember },
        },
        rsp: {
          ...mockState.rsp,
          client: { ...rspClient, status: RspClientStatus.active },
        },
      },
    });
    const select = queryByRole('combobox', { name: 'Case Manager' });
    expect(select).not.toBeInTheDocument();
  });
});
