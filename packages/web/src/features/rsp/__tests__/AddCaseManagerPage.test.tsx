import userEvent from '@testing-library/user-event';
import { useRouter } from 'next/router';
import { act, fireEvent, fixtures, mockState, mockThunks, render, waitFor } from '@test';
import * as actions from '../actions';
import { AddCaseManagerPage } from '../AddCaseManagerPage';

const { rspAccountMember } = fixtures;

jest.mock('@app/hooks', () => ({
  ...jest.requireActual('@app/hooks'),
  useFormattedPhoneNumber: () => ({
    formatNumber: { reset: jest.fn(), input: (value: string) => value },
    parsePhoneNumber: jest.fn(),
  }),
}));

describe('AddCaseManagerPage', () => {
  beforeEach(() => {
    (useRouter as jest.Mock).mockImplementation(() => ({
      push: jest.fn(),
    }));
  });

  test('renders correctly', async () => {
    const { container, findByText } = render(<AddCaseManagerPage />, {
      initialState: {
        ...mockState,
        auth: {
          user: { rspAccount: rspAccountMember },
        },
      },
    });

    await waitFor(async () => expect(await findByText('First Name')).toBeInTheDocument());
    expect(container).toMatchSnapshot();
  });

  test('handles submission', async () => {
    const [inviteCaseManager] = mockThunks(actions, ['inviteCaseManager']);

    const { getByLabelText, getByRole, dispatch } = render(<AddCaseManagerPage />, {
      initialState: {
        ...mockState,
        auth: {
          user: { rspAccount: rspAccountMember },
        },
      },
    });

    await userEvent.type(getByLabelText('First Name'), 'firstname', { delay: 1 });
    await userEvent.type(getByLabelText('Last Name'), 'lastname', { delay: 1 });
    await userEvent.type(getByLabelText('Email'), 'email@email.com', { delay: 1 });
    await userEvent.type(getByLabelText('Phone'), '(334) 444-4444', { delay: 1 });

    await act(() => fireEvent.click(getByRole('button', { name: 'Invite Case Manager' })));

    expect(inviteCaseManager).toBeCalledWith({
      firstName: 'firstname',
      lastName: 'lastname',
      email: 'email@email.com',
      phone: '3344444444',
      rspId: rspAccountMember.rspId,
    });
    expect(dispatch).toBeCalled();
  });
});
