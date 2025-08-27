import { VeteranOrJustice } from '@two/shared';
import { fixtures, mockState, render, waitFor } from '@test';
import { OrganizationSettingsTab } from '../OrganizationSettingsTab';

describe('OrganizationSettingsTab', () => {
  test('renders correctly', async () => {
    const { container, findByText } = render(<OrganizationSettingsTab />);
    await waitFor(async () =>
      expect(await findByText('Organization Information')).toBeInTheDocument(),
    );

    expect(container).toMatchSnapshot();
  });

  test('hides the justice status and offenses sections when only veterans applicants allowed', async () => {
    const initialState = {
      ...mockState,
      rsp: { rsp: { ...fixtures.rsp, veteranOrJustice: [VeteranOrJustice.veteran] } },
    };
    const { queryByText, findByText } = render(<OrganizationSettingsTab />, { initialState });
    await waitFor(async () =>
      expect(await findByText('Organization Information')).toBeInTheDocument(),
    );
    expect(queryByText('Accepted Justice Status')).not.toBeInTheDocument();
    expect(queryByText('Allowed Offenses')).not.toBeInTheDocument();
  });

  test('shows the justice status and offenses sections when justice impacted applicants allowed', async () => {
    const initialState = {
      ...mockState,
      rsp: {
        rsp: {
          ...fixtures.rsp,
          veteranOrJustice: [VeteranOrJustice.veteran, VeteranOrJustice.justiceImpacted],
        },
      },
    };
    const { queryByText, findByText } = render(<OrganizationSettingsTab />, { initialState });
    await waitFor(async () =>
      expect(await findByText('Organization Information')).toBeInTheDocument(),
    );
    expect(queryByText('Accepted Justice Status')).toBeInTheDocument();
    expect(queryByText('Allowed Offenses')).toBeInTheDocument();
  });
});
