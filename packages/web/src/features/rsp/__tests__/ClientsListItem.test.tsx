import { Toast } from '@disruptive-labs/ui';
import userEvent from '@testing-library/user-event';
import { act, fixtures, mockThunks, render, waitFor } from '@test';
import * as actions from '../actions';
import { ClientsListItem } from '../ClientsListItem';

const { rspClient, rsp } = fixtures;

describe('ClientsListItem', () => {
  test('renders correctly', async () => {
    const { container, findByText } = render(<ClientsListItem {...rspClient} />);
    await waitFor(async () =>
      expect(
        await findByText(`${rspClient.user.firstName} ${rspClient.user.lastName}`),
      ).toBeInTheDocument(),
    );
    expect(container).toMatchSnapshot();
  });

  test('opens modal and delete client', async () => {
    const [declineClient] = mockThunks(actions, ['declineClient']);
    const { findByTestId, findByRole, findByText } = render(<ClientsListItem {...rspClient} />);
    await waitFor(async () =>
      expect(
        await findByText(`${rspClient.user.firstName} ${rspClient.user.lastName}`),
      ).toBeInTheDocument(),
    );

    await act(async () => userEvent.click(await findByTestId('menu')));
    const deleteItem = await findByRole('menuitem', { name: 'Delete' });
    await waitFor(async () => expect(deleteItem).toBeInTheDocument());
    await act(async () => userEvent.click(deleteItem));
    await waitFor(async () =>
      expect(await findByText('Are you sure you want to delete Case Manager?')).toBeInTheDocument(),
    );
    await userEvent.click(await findByRole('button', { name: 'Delete' }));
    expect(Toast.success).toHaveBeenCalledWith('Client status changed to closed.');
    expect(declineClient).toBeCalledWith({ rspId: rsp.id, clientId: rspClient.id });
  });
});
