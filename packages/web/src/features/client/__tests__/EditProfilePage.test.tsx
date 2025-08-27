import userEvent from '@testing-library/user-event';
import { useRouter } from 'next/router';
import { JusticeStatus, VeteranOrJustice } from '@two/shared';
import { ClientProfileSections } from '@app/components/ClientProfile';
import { clientProfile } from '@app/data/clientProfileText';
import { act, fireEvent, fixtures, mockState, mockThunks, render, waitFor } from '@test';
import * as actions from '../actions';
import { EditProfilePage } from '../EditProfilePage';

jest.mock('@app/hooks', () => ({
  ...jest.requireActual('@app/hooks'),
  useAppAuth: jest.fn(),
}));

const text: { [key in ClientProfileSections]: string } = {
  [ClientProfileSections.account]: 'Personal Information',
  [ClientProfileSections.professionalSummary]: 'Professional Summary',
  [ClientProfileSections.militaryExperience]: 'Branch of Service',
  [ClientProfileSections.offenseHistory]: 'Nature of Offense',
  [ClientProfileSections.employmentHistory]: 'Add New Position',
  [ClientProfileSections.education]: 'Add New Education',
  [ClientProfileSections.licenses]: 'Add New License',
  [ClientProfileSections.personalStrengths]: 'Personal Strengths',
  [ClientProfileSections.skills]: 'Experience/Skills',
  [ClientProfileSections.languages]: 'Add New Language',
  [ClientProfileSections.personalInformation]: '',
  [ClientProfileSections.supportNeeds]: '',
};

describe('EditProfilePage', () => {
  Object.values(ClientProfileSections)
    .filter(
      (el) =>
        el !== ClientProfileSections.personalInformation &&
        el !== ClientProfileSections.supportNeeds,
    )
    .forEach((section) => {
      test(`renders correctly - ${section}`, async () => {
        (useRouter as jest.Mock).mockImplementation(() => ({
          query: { section },
          beforePopState: jest.fn(),
        }));

        const initialState = {
          ...mockState,
          auth: {
            user: {
              ...fixtures.user,
              client: fixtures.veteranAndJusticeImpactedClient,
            },
          },
        };

        const { container, findByText } = render(<EditProfilePage />, { initialState });
        await waitFor(async () => expect(await findByText(text[section])).toBeInTheDocument());

        expect(container).toMatchSnapshot();
      });
    });

  test("hide offense specific fields if 'No Offense' chosen", async () => {
    (useRouter as jest.Mock).mockImplementation(() => ({
      query: { section: ClientProfileSections.offenseHistory },
      beforePopState: jest.fn(),
    }));

    const { container, queryByText, findByText } = render(<EditProfilePage />, {
      initialState: {
        ...mockState,
        auth: {
          user: {
            ...fixtures.user,
            client: { ...fixtures.client, justiceStatus: JusticeStatus.noOffense },
          },
        },
      },
    });
    await waitFor(async () =>
      expect(await findByText('Current Justice Status')).toBeInTheDocument(),
    );
    expect(queryByText('Nature of Offense')).not.toBeInTheDocument();
    expect(queryByText('Time Served')).not.toBeInTheDocument();
    expect(queryByText('Completed Sentence')).not.toBeInTheDocument();
    expect(queryByText('State or Federal Offense')).not.toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });

  test("show offense specific fields if else than 'No Offense' chosen", async () => {
    (useRouter as jest.Mock).mockImplementation(() => ({
      query: { section: ClientProfileSections.offenseHistory },
      beforePopState: jest.fn(),
    }));

    const { queryByText, findByText } = render(<EditProfilePage />);
    await waitFor(async () =>
      expect(await findByText('Current Justice Status')).toBeInTheDocument(),
    );
    expect(queryByText('Nature of Offense')).toBeInTheDocument();
    expect(queryByText('Time Served')).toBeInTheDocument();
    expect(queryByText('Completed Sentence')).toBeInTheDocument();
    expect(queryByText('State or Federal')).toBeInTheDocument();
  });

  test('shows and hides extra fields in "Current Justice Status" section depend on "currently Incarcerated" option', async () => {
    (useRouter as jest.Mock).mockImplementation(() => ({
      query: { section: ClientProfileSections.offenseHistory },
      beforePopState: jest.fn(),
      replace: jest.fn(),
    }));

    const { findByRole, queryByText, findByText } = render(<EditProfilePage />, {
      initialState: {
        ...mockState,
        auth: {
          user: {
            ...fixtures.user,
            client: { ...fixtures.client, justiceStatus: JusticeStatus.currentlyIncarcerated },
          },
        },
      },
    });
    await waitFor(async () =>
      expect(await findByText('Current Justice Status')).toBeInTheDocument(),
    );
    expect(queryByText('Expected Release Date')).toBeInTheDocument();
    expect(queryByText('Correctional Facility')).toBeInTheDocument();
    expect(queryByText('Release County')).toBeInTheDocument();

    await userEvent.selectOptions(
      await findByRole('combobox', { name: 'Current Justice Status' }),
      clientProfile[JusticeStatus.freeWorld],
    );

    expect(queryByText('Expected Release Date')).not.toBeInTheDocument();
    expect(queryByText('Correctional Facility')).not.toBeInTheDocument();
    expect(queryByText('Release County')).not.toBeInTheDocument();
  });

  test('sends null in extra fields in "Current Justice Status" section when change from "Current Justice Status" to another', async () => {
    const [updateClient] = mockThunks(actions, ['updateClient']);

    const { findByRole, findAllByRole } = render(<EditProfilePage />, {
      initialState: {
        ...mockState,
        auth: {
          user: {
            ...fixtures.user,
            client: {
              ...fixtures.client,
              justiceStatus: JusticeStatus.currentlyIncarcerated,
              facility: 'facility',
              expectedReleasedAt: 'expectedReleasedAt',
              releasedCounty: 'releasedCounty',
            },
          },
        },
      },
    });

    await userEvent.selectOptions(
      await findByRole('combobox', { name: 'Current Justice Status' }),
      clientProfile[JusticeStatus.freeWorld],
    );
    await act(async () => fireEvent.click((await findAllByRole('button', { name: 'Save' }))[0]));

    expect(updateClient).toBeCalledWith(
      expect.objectContaining({
        justiceStatus: JusticeStatus.freeWorld,
        facility: null,
        expectedReleasedAt: null,
        releasedCounty: null,
      }),
    );
  });

  test('shows "Military Experience" tab if client is veteran', async () => {
    const initialState = {
      ...mockState,
      auth: {
        user: {
          ...fixtures.user,
          client: fixtures.veteranClient,
        },
      },
    };
    const { container, queryByRole, findByRole } = render(<EditProfilePage />, {
      initialState,
    });
    expect(await findByRole('tab', { name: 'Military History' })).toBeInTheDocument();
    expect(queryByRole('tab', { name: 'Offense History' })).not.toBeInTheDocument();

    expect(container).toMatchSnapshot();
  });

  test('shows "Military Experience" tab if client is veteran', async () => {
    const initialState = {
      ...mockState,
      auth: {
        user: {
          ...fixtures.user,
          client: fixtures.veteranClient,
        },
      },
    };
    const { container, queryByRole, findByRole } = render(<EditProfilePage />, {
      initialState,
    });
    expect(await findByRole('tab', { name: 'Military History' })).toBeInTheDocument();
    expect(queryByRole('tab', { name: 'Offense History' })).not.toBeInTheDocument();

    expect(container).toMatchSnapshot();
  });

  test('shows "Offense History" tab if client is justiceImpacted', async () => {
    const { queryByRole, findByRole } = render(<EditProfilePage />);
    expect(await findByRole('tab', { name: 'Offense History' })).toBeInTheDocument();
    expect(queryByRole('tab', { name: 'Military History' })).not.toBeInTheDocument();
  });

  test('shows both "Military Experience" and "Offense History" section if client is veteran and justiceImpacted', async () => {
    const initialState = {
      ...mockState,
      auth: {
        user: {
          ...fixtures.user,
          client: fixtures.veteranAndJusticeImpactedClient,
        },
      },
    };
    const { container, findByRole } = render(<EditProfilePage />, {
      initialState,
    });
    expect(await findByRole('tab', { name: 'Military History' })).toBeInTheDocument();
    expect(await findByRole('tab', { name: 'Offense History' })).toBeInTheDocument();

    expect(container).toMatchSnapshot();
  });
});
