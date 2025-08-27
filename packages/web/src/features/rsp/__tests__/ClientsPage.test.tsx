import { RspRole } from '@two/shared';
import { createState, fireEvent, MockedThunk, mockState, mockThunks, render, waitFor } from '@test';
import * as actions from '../actions';
import { ClientsPage } from '../ClientsPage';

describe('ClientsPage', () => {
  let listClients: MockedThunk;

  beforeEach(() => {
    [listClients] = mockThunks(actions, ['listClients']);
  });

  test('renders correctly', async () => {
    const { container, findByText } = render(<ClientsPage />, {
      initialState: {
        ...mockState,
        auth: { user: { rspAccount: { isProfileFilled: true } } },
      },
    });

    await waitFor(async () => expect(await findByText('Clients')).toBeInTheDocument());
    expect(container).toMatchSnapshot();
  });

  test('not shows spinner and calls only initial list if no more clients to load', async () => {
    const initialState = createState({
      auth: {
        user: {
          id: 'TEST_ID',
          rspAccount: { rsp: {}, isProfileFilled: true, role: RspRole.member },
        },
      },
    });
    const { queryByTestId } = render(<ClientsPage />, { initialState });

    fireEvent.scroll(window, { target: { scrollY: 100 } });
    await waitFor(() => expect(queryByTestId('loading-spinner')).not.toBeInTheDocument());
    expect(listClients).toBeCalledTimes(1); // only initial load
  });

  test('scroll to bottom of list triggers spinner and calls list client for member', async () => {
    const initialState = createState({
      auth: {
        user: {
          id: 'TEST_ID',
          rspAccount: { rsp: {}, isProfileFilled: true, role: RspRole.member },
        },
      },
      rsp: {
        clients: {
          ...mockState.rsp.clients,
          total: 3,
        },
      },
    });
    const { queryByTestId } = render(<ClientsPage />, { initialState });

    fireEvent.scroll(window, { target: { scrollY: 100 } });
    await waitFor(() => expect(queryByTestId('loading-spinner')).toBeInTheDocument());
    expect(listClients).toBeCalledTimes(2);
  });

  test('scroll to bottom of list triggers spinner and calls list client for owner', async () => {
    const initialState = createState({
      auth: {
        user: {
          id: 'TEST_ID',
          rspAccount: { rsp: {}, isProfileFilled: true, role: RspRole.owner },
        },
      },
      rsp: {
        clients: {
          ...mockState.rsp.clients,
          total: 3,
        },
      },
    });
    const { queryByTestId } = render(<ClientsPage />, { initialState });

    fireEvent.scroll(window, { target: { scrollY: 100 } });
    await waitFor(() => expect(queryByTestId('loading-spinner')).toBeInTheDocument());
    expect(listClients).toBeCalledTimes(2);
  });
});
