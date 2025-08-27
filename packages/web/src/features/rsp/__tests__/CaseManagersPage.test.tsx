import userEvent from '@testing-library/user-event';
import { useRouter } from 'next/router';
import { act, createState, fireEvent, fixtures, mockThunks, render, waitFor } from '@test';
import * as actions from '../actions';
import { CaseManagersPage } from '../CaseManagersPage';

const { rspAccountOwner, rspAccountMember } = fixtures;

const initialState = createState({
  auth: {
    user: { rspAccount: rspAccountOwner },
  },
  'rsp.caseManagers': {
    ids: [rspAccountMember.id],
    entities: { [rspAccountMember.id]: rspAccountMember },
  },
});

describe('CaseManagersPage', () => {
  let push: jest.Mock;

  beforeEach(() => {
    push = jest.fn();
    (useRouter as jest.Mock).mockImplementation(() => ({
      push: jest.fn(),
      replace: jest.fn(),
    }));
  });

  test('renders correctly', async () => {
    const { container, findByText } = render(<CaseManagersPage />, { initialState });
    await waitFor(async () => expect(await findByText('Case Managers')).toBeInTheDocument());
    expect(container).toMatchSnapshot();
  });

  test('renders correctly invitations tab', async () => {
    const { container, findByRole } = render(<CaseManagersPage />, { initialState });
    await userEvent.click(await findByRole('tab', { name: 'Invited' }));
    expect(container).toMatchSnapshot();
  });

  test('handles remove case manager', async () => {
    const [removeCaseManager] = mockThunks(actions, ['removeCaseManager']);

    const { findByRole, getByRole, getByTestId } = render(<CaseManagersPage />, { initialState });

    await act(async () => fireEvent.click(getByTestId('menu')));
    await userEvent.click(await findByRole('menuitem', { name: 'Delete' }));

    expect(
      getByRole('dialog', { name: 'Are you sure you want to delete Case Manager?' }),
    ).toBeInTheDocument();
    await act(async () => fireEvent.click(await findByRole('button', { name: 'Delete' })));

    expect(removeCaseManager).toBeCalled();
  });

  test('handles remove invitation', async () => {
    const [removeInvitation] = mockThunks(actions, ['removeInvitation']);

    const { findByRole, getByRole, getByTestId } = render(<CaseManagersPage />, { initialState });
    await userEvent.click(await findByRole('tab', { name: 'Invited' }));

    await act(async () => fireEvent.click(getByTestId('menu')));
    await userEvent.click(await findByRole('menuitem', { name: 'Delete' }));

    expect(
      getByRole('dialog', { name: 'Are you sure you want to delete this invitation?' }),
    ).toBeInTheDocument();
    await act(async () => fireEvent.click(await findByRole('button', { name: 'Delete' })));

    expect(removeInvitation).toBeCalled();
  });
});
