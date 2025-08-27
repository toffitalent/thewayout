import userEvent from '@testing-library/user-event';
import { useRouter } from 'next/router';
import {
  JusticeStatus,
  justiceText,
  OffenseCategory,
  offenseText,
  RspPosition,
  rspPositionText,
  RspRole,
  State,
  states,
  Support,
  supportText,
  VeteranOrJustice,
} from '@two/shared';
import { act, fireEvent, fixtures, mockState, mockThunks, render, waitFor } from '@test';
import * as actions from '../actions';
import { CreateProfilePage } from '../CreateProfilePage';

const { user } = fixtures;

describe('CreateProfilePage', () => {
  let push: jest.Mock;

  beforeEach(() => {
    push = jest.fn();

    (useRouter as jest.Mock).mockImplementation(() => ({
      beforePopState: jest.fn(),
      push,
    }));
  });

  test('renders correctly', async () => {
    const { container, findByText } = render(<CreateProfilePage />, {
      initialState: {
        ...mockState,
        auth: { user: { ...user, rspAccount: { isProfileFilled: false } } },
      },
    });

    await waitFor(async () => expect(await findByText('Phone number')).toBeInTheDocument());
    expect(container).toMatchSnapshot();
  });

  test('redirects owner if rsp account is filled by user', async () => {
    render(<CreateProfilePage />, {
      initialState: {
        ...mockState,
        auth: { user: { ...user, rspAccount: { isProfileFilled: true, role: RspRole.owner } } },
      },
    });

    expect(push).toBeCalledWith('/ssp/case-managers');
  });

  test('redirects owner if rsp account is filled by user', async () => {
    render(<CreateProfilePage />, {
      initialState: {
        ...mockState,
        auth: { user: { ...user, rspAccount: { isProfileFilled: true, role: RspRole.member } } },
      },
    });

    expect(push).toBeCalledWith('/ssp/clients');
  });

  test('creates rsp organization and updates owner account', async () => {
    const [createRsp] = mockThunks(actions, ['createRsp']);

    const { findByRole, findByText, getAllByLabelText, dispatch } = render(<CreateProfilePage />, {
      initialState: {
        ...mockState,
        auth: { user: { ...user, rspAccount: { isProfileFilled: false, role: RspRole.owner } } },
      },
    });

    // Phone Number step
    await userEvent.type(await findByRole('textbox', { name: 'Phone number' }), '3344441224', {
      delay: 1,
    });
    await act(async () => fireEvent.click(await findByRole('button', { name: 'Save & Next' })));

    // Avatar step
    await act(async () => fireEvent.click(await findByRole('button', { name: 'Save & Next' })));

    // Role step
    await userEvent.selectOptions(
      await findByRole('combobox'),
      rspPositionText[RspPosition.operationManager],
    );
    await act(async () => fireEvent.click(await findByRole('button', { name: 'Save & Next' })));

    // Organization Name step
    await userEvent.type(await findByRole('textbox', { name: 'Name' }), 'Test Organization', {
      delay: 1,
    });
    await act(async () => fireEvent.click(await findByRole('button', { name: 'Save & Next' })));

    // Rsp avatar step
    await act(async () => fireEvent.click(await findByRole('button', { name: 'Save & Next' })));

    // Organization Description step
    await userEvent.type(await findByRole('textbox', { name: 'Description' }), 'Test Description', {
      delay: 1,
    });
    await act(async () => fireEvent.click(await findByRole('button', { name: 'Save & Next' })));

    // Business Address step
    await userEvent.type(await findByRole('textbox', { name: 'Your Address' }), '111 Street', {
      delay: 1,
    });
    await userEvent.type(await findByRole('textbox', { name: 'Town / City' }), 'Los Angeles', {
      delay: 1,
    });
    await userEvent.selectOptions(await findByRole('combobox'), states[State.AK]);
    await userEvent.type(await findByRole('textbox', { name: 'Zip Code' }), '90111', {
      delay: 1,
    });
    await act(async () => fireEvent.click(await findByRole('button', { name: 'Save & Next' })));

    // Service Area step
    await userEvent.type(getAllByLabelText('Search Area')[0], 'W');
    await act(async () => fireEvent.click(await findByRole('option', { name: 'Washington' })));
    expect(await findByText('Selected Service Areas')).toBeInTheDocument();
    await act(async () => fireEvent.click(await findByRole('button', { name: 'Save & Next' })));

    // Veteran or Justice Impacted step
    await act(async () =>
      fireEvent.click(await findByRole('checkbox', { name: 'Justice Impacted' })),
    );
    await act(async () => fireEvent.click(await findByRole('button', { name: 'Save & Next' })));

    // Support step
    await act(async () =>
      fireEvent.click(await findByRole('checkbox', { name: supportText[Support.employment] })),
    );
    await act(async () => fireEvent.click(await findByRole('button', { name: 'Save & Next' })));

    // Organization Contact Info step
    await userEvent.type(
      await findByRole('textbox', { name: 'Phone Number (Optional)' }),
      '3344441223',
      {
        delay: 1,
      },
    );
    await userEvent.type(
      await findByRole('textbox', { name: 'Email (Optional)' }),
      'test@test.com',
      {
        delay: 1,
      },
    );
    await act(async () => fireEvent.click(await findByRole('button', { name: 'Save & Next' })));

    // Accepted Justice Status step
    await act(async () =>
      fireEvent.click(
        await findByRole('checkbox', { name: justiceText[JusticeStatus.extendedSupervision] }),
      ),
    );
    await act(async () => fireEvent.click(await findByRole('button', { name: 'Save & Next' })));

    // Allowed Offenses step
    await act(async () =>
      fireEvent.click(await findByRole('checkbox', { name: offenseText[OffenseCategory.arson] })),
    );
    await act(async () => fireEvent.click(await findByRole('button', { name: 'Save & Next' })));

    expect(createRsp).toBeCalledWith({
      name: 'Test Organization',
      description: 'Test Description',
      address: '111 Street',
      city: 'Los Angeles',
      state: State.AK,
      postalCode: '90111',
      servicesArea: ['Washington'],
      support: [Support.employment],
      justiceStatus: [JusticeStatus.extendedSupervision],
      offenses: [OffenseCategory.arson],
      phone: '3344441223',
      email: 'test@test.com',
      owner: {
        phone: '3344441224',
        position: RspPosition.operationManager,
        avatar: undefined,
      },
      veteranOrJustice: [VeteranOrJustice.justiceImpacted],
    });
    expect(dispatch).toBeCalled();
  }, 20000);

  test('creates member account', async () => {
    const [createMember] = mockThunks(actions, ['createMember']);

    const { findByRole, dispatch } = render(<CreateProfilePage />, {
      initialState: {
        ...mockState,
        auth: {
          user: {
            ...user,
            rspAccount: {
              id: 'TEST_ID',
              rspId: 'TEST_RSP_ID',
              isProfileFilled: false,
              role: RspRole.member,
            },
          },
        },
      },
    });

    // Phone Number step
    await userEvent.type(await findByRole('textbox', { name: 'Phone number' }), '3344441224', {
      delay: 1,
    });
    await act(async () => fireEvent.click(await findByRole('button', { name: 'Save & Next' })));

    // Avatar step
    await act(async () => fireEvent.click(await findByRole('button', { name: 'Save & Next' })));

    expect(createMember).toBeCalledWith({
      phone: '3344441224',
      avatar: undefined,
      rspId: 'TEST_RSP_ID',
      userId: user.id,
    });
    expect(dispatch).toBeCalled();
  });
});
