import userEvent from '@testing-library/user-event';
import { UserType } from '@two/shared';
import { mockState, render } from '@test';
import { AccountSettingsPage } from '../AccountSettingsPage';

const initialState = {
  ...mockState,
  auth: { user: { employer: { name: 'Test' }, type: UserType.Employer } },
};

describe('AccountSettingsPage', () => {
  test('renders correctly Account tab', async () => {
    const { container, queryByText } = render(<AccountSettingsPage />, { initialState });

    expect(queryByText('Personal Information')).toBeInTheDocument();
    expect(queryByText('Organization Information')).not.toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });

  test('renders correctly Organization tab', async () => {
    const { container, getByRole, queryByText } = render(<AccountSettingsPage />, { initialState });

    await userEvent.click(getByRole('tab', { name: 'Organization' }));
    expect(queryByText('Personal Information')).not.toBeInTheDocument();
    expect(queryByText('Organization Information')).toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });
});
