import { UserType } from '@two/shared';
import { createState, render, waitFor } from '@test';
import { OrganizationSettingsTab } from '../OrganizationSettingsTab';

const initialState = createState({
  auth: { user: { employer: { name: 'Test' }, type: UserType.Employer } },
});

describe('OrganizationSettingsTab', () => {
  test('renders correctly', async () => {
    const { container, findByText } = render(<OrganizationSettingsTab />, { initialState });
    await waitFor(async () =>
      expect(await findByText('Organization Information')).toBeInTheDocument(),
    );

    expect(container).toMatchSnapshot();
  });
});
