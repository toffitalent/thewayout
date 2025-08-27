import userEvent from '@testing-library/user-event';
import { useRouter } from 'next/router';
import {
  ExperienceSkills,
  JusticeStatus,
  OffenseCategory,
  PersonalStrengths,
  ReferredBy,
  ReleasedAt,
  StateFederal,
  Support,
  TimeServed,
  VeteranBranchOfService,
  VeteranCampaign,
  VeteranOrJustice,
  VeteranRank,
  VeteranTypeDischarge,
} from '@two/shared';
import { clientProfile as text } from '@app/data/clientProfileText';
import { act, fireEvent, fixtures, mockState, mockThunks, render, waitFor } from '@test';
import * as actions from '../actions';
import { CreateProfilePage } from '../CreateProfilePage';

jest.mock('@app/hooks', () => ({
  ...jest.requireActual('@app/hooks'),
  useAppAuth: jest.fn(),
}));

const partialRequestData = {
  address: '111 Street',
  city: 'Los Angeles',
  experience: [ExperienceSkills.carpentry],
  personalStrengths: [
    'communicatesWell',
    'creative',
    'dealsWellWithChange',
    'detailOriented',
    'goodWithTechnology',
  ],
  postalCode: '90111',
  referredBy: ReferredBy.familyFriends,
  state: 'CA',
  support: [Support.employment],
  disability: undefined,
  ethnicity: undefined,
  age: undefined,
  gender: undefined,
  maritalStatus: undefined,
  orientation: undefined,
  phone: null,
  religion: undefined,
  veteranStatus: undefined,
  relativeExperience: [],
  rspId: fixtures.rsp.id,
  isNewRspMember: false,
};
const partialJusticeImpactedData = {
  expectedReleasedAt: undefined,
  facility: undefined,
  releasedCounty: undefined,
};

const fillStepsForAllClients = async (findByRole: any) => {
  // Phone number
  await act(async () => fireEvent.click(await findByRole('button', { name: 'Save & Next' })));

  // Address number
  await userEvent.type(await findByRole('textbox', { name: 'Your Address' }), '111 Street', {
    delay: 1,
  });
  await userEvent.type(await findByRole('textbox', { name: 'Town / City' }), 'Los Angeles', {
    delay: 1,
  });
  await userEvent.selectOptions(await findByRole('combobox'), 'California');
  await userEvent.type(await findByRole('textbox', { name: 'Postcode / Zipcode' }), '90111', {
    delay: 1,
  });
  await act(async () => fireEvent.click(await findByRole('button', { name: 'Next' })));

  // Support step
  await act(async () =>
    fireEvent.click(await findByRole('checkbox', { name: text[Support.employment] })),
  );
  await act(async () => fireEvent.click(await findByRole('button', { name: 'Next' })));

  // Rsp step
  await act(async () => fireEvent.click(await findByRole('radio', { name: fixtures.rsp.name })));
  await act(async () => fireEvent.click(await findByRole('button', { name: 'Next' })));

  // Personal strengths step
  await act(async () =>
    fireEvent.click(
      await findByRole('checkbox', { name: text[PersonalStrengths.communicatesWell] }),
    ),
  );
  await act(async () =>
    fireEvent.click(await findByRole('checkbox', { name: text[PersonalStrengths.creative] })),
  );
  await act(async () =>
    fireEvent.click(
      await findByRole('checkbox', { name: text[PersonalStrengths.dealsWellWithChange] }),
    ),
  );
  await act(async () =>
    fireEvent.click(await findByRole('checkbox', { name: text[PersonalStrengths.detailOriented] })),
  );
  await act(async () =>
    fireEvent.click(
      await findByRole('checkbox', { name: text[PersonalStrengths.goodWithTechnology] }),
    ),
  );
  await act(async () => fireEvent.click(await findByRole('button', { name: 'Next' })));

  // Skills step
  await act(async () =>
    fireEvent.click(await findByRole('checkbox', { name: text[ExperienceSkills.carpentry] })),
  );
  await act(async () => fireEvent.click(await findByRole('button', { name: 'Next' })));

  // Language step
  await act(async () => fireEvent.click(await findByRole('button', { name: 'Skip' })));

  // Experience step
  await act(async () => fireEvent.click(await findByRole('button', { name: 'Skip' })));

  // Personal Summary step
  await act(async () => fireEvent.click(await findByRole('button', { name: 'Skip' })));

  // Education step
  await act(async () => fireEvent.click(await findByRole('button', { name: 'Skip' })));

  // License step
  await act(async () => fireEvent.click(await findByRole('button', { name: 'Skip' })));

  // Diversity step
  await act(async () => fireEvent.click(await findByRole('button', { name: 'Next' })));

  // Referred by step
  await act(async () =>
    fireEvent.click(await findByRole('radio', { name: text[ReferredBy.familyFriends] })),
  );
  await act(async () => fireEvent.click(await findByRole('button', { name: 'Submit' })));
};

describe('CreateProfilePage', () => {
  beforeEach(() => {
    (useRouter as jest.Mock).mockImplementation(() => ({
      beforePopState: jest.fn(),
    }));
  });

  test('renders correctly', async () => {
    const { container } = await waitFor(() =>
      render(<CreateProfilePage />, {
        initialState: { ...mockState, auth: { user: { ...fixtures.user, client: undefined } } },
      }),
    );
    expect(container).toMatchSnapshot();
  });

  test('renders no content if no user', async () => {
    const { container } = render(<CreateProfilePage />, {
      initialState: { ...mockState, auth: { user: null } },
    });

    expect(container).toMatchSnapshot();
  });

  test("show offense steps if else than 'No Offense' chosen", async () => {
    const [createClient] = mockThunks(actions, ['createClient']);
    const { findByRole, queryByText, dispatch } = render(<CreateProfilePage />, {
      initialState: { ...mockState, auth: { user: { ...fixtures.user, client: undefined } } },
    });

    // Veteran or Justice Impacted step
    await act(async () =>
      fireEvent.click(
        await findByRole('checkbox', { name: text[VeteranOrJustice.justiceImpacted] }),
      ),
    );
    await act(async () => fireEvent.click(await findByRole('button', { name: 'Save & Next' })));

    // Justice status step
    await act(async () =>
      fireEvent.click(await findByRole('radio', { name: text[JusticeStatus.halfwayHouse] })),
    );
    await act(async () => fireEvent.click(await findByRole('button', { name: 'Next' })));

    expect(queryByText("What's your phone number?")).not.toBeInTheDocument();
    expect(queryByText('Nature Of Offense(s)')).toBeInTheDocument();

    // Offense step
    await act(async () =>
      fireEvent.click(await findByRole('checkbox', { name: text[OffenseCategory.burglary] })),
    );
    await act(async () => fireEvent.click(await findByRole('button', { name: 'Save & Next' })));

    // Time served step
    await act(async () =>
      fireEvent.click(await findByRole('radio', { name: text[TimeServed.timeServed01] })),
    );
    await act(async () => fireEvent.click(await findByRole('button', { name: 'Next' })));

    // Completed sentence step
    await act(async () =>
      fireEvent.click(await findByRole('radio', { name: text[ReleasedAt.releasedAt01] })),
    );
    await act(async () => fireEvent.click(await findByRole('button', { name: 'Next' })));

    // State or federal
    await act(async () =>
      fireEvent.click(await findByRole('radio', { name: text[StateFederal.federal] })),
    );
    await act(async () => fireEvent.click(await findByRole('button', { name: 'Next' })));

    await fillStepsForAllClients(findByRole);

    expect(createClient).toBeCalledWith({
      veteranOrJustice: [VeteranOrJustice.justiceImpacted],
      ...partialRequestData,
      ...partialJusticeImpactedData,
      justiceStatus: JusticeStatus.halfwayHouse,
      offense: [OffenseCategory.burglary],
      releasedAt: ReleasedAt.releasedAt01,
      sbn: undefined,
      sexualOffenderRegistry: undefined,
      stateOrFederal: StateFederal.federal,
      timeServed: TimeServed.timeServed01,
      education: [],
      license: [],
    });
    expect(dispatch).toBeCalled();
  }, 20000);

  test("skip offense steps if 'No Offense' chosen", async () => {
    const [createClient] = mockThunks(actions, ['createClient']);
    const { findByRole, queryByText, dispatch } = render(<CreateProfilePage />, {
      initialState: { ...mockState, auth: { user: { ...fixtures.user, client: undefined } } },
    });

    // Veteran or Justice Impacted step
    await act(async () =>
      fireEvent.click(
        await findByRole('checkbox', { name: text[VeteranOrJustice.justiceImpacted] }),
      ),
    );
    await act(async () => fireEvent.click(await findByRole('button', { name: 'Save & Next' })));

    // Justice status step
    await act(async () =>
      fireEvent.click(await findByRole('radio', { name: text[JusticeStatus.noOffense] })),
    );
    await act(async () => fireEvent.click(await findByRole('button', { name: 'Next' })));

    expect(queryByText('Nature Of Offense(s)')).not.toBeInTheDocument();
    expect(queryByText("What's your phone number?")).toBeInTheDocument();

    await fillStepsForAllClients(findByRole);

    expect(createClient).toBeCalledWith({
      veteranOrJustice: [VeteranOrJustice.justiceImpacted],
      ...partialRequestData,
      ...partialJusticeImpactedData,
      justiceStatus: JusticeStatus.noOffense,
      offense: [],
      releasedAt: null,
      sbn: undefined,
      sexualOffenderRegistry: undefined,
      stateOrFederal: null,
      timeServed: null,
      education: [],
      license: [],
    });
    expect(dispatch).toBeCalled();
  }, 20000);

  test("Skip 'Completed sentence' step if 'Currently Incarcerated' justice option chosen and automatically set to 'Not Completed", async () => {
    const [createClient] = mockThunks(actions, ['createClient']);
    const { findByRole, queryByText, getByLabelText, dispatch } = render(<CreateProfilePage />, {
      initialState: { ...mockState, auth: { user: { ...fixtures.user, client: undefined } } },
    });

    // Veteran or Justice Impacted step
    await act(async () =>
      fireEvent.click(
        await findByRole('checkbox', { name: text[VeteranOrJustice.justiceImpacted] }),
      ),
    );
    await act(async () => fireEvent.click(await findByRole('button', { name: 'Save & Next' })));

    // Justice status step
    await act(async () =>
      fireEvent.click(
        await findByRole('radio', { name: text[JusticeStatus.currentlyIncarcerated] }),
      ),
    );
    await act(async () => fireEvent.click(await findByRole('button', { name: 'Next' })));

    // Correctional Facility step
    await userEvent.selectOptions(
      await findByRole('combobox'),
      'Chippewa Valley Correctional Treatment Facility',
    );
    await act(async () => fireEvent.click(await findByRole('button', { name: 'Save & Next' })));
    // Expected Release Date step
    await userEvent.type(
      getByLabelText('Expected Release Date'),
      `${new Date().getFullYear() + 1}-10-10}`,
      {
        delay: 1,
      },
    );
    await act(async () => fireEvent.click(await findByRole('button', { name: 'Save & Next' })));

    // County step
    await userEvent.selectOptions(await findByRole('combobox'), 'Adams');
    await act(async () => fireEvent.click(await findByRole('button', { name: 'Save & Next' })));

    expect(queryByText('Nature Of Offense(s)')).toBeInTheDocument();

    // Offense step
    await act(async () =>
      fireEvent.click(await findByRole('checkbox', { name: text[OffenseCategory.burglary] })),
    );
    await act(async () => fireEvent.click(await findByRole('button', { name: 'Save & Next' })));

    // Time served step
    await act(async () =>
      fireEvent.click(await findByRole('radio', { name: text[TimeServed.timeServed01] })),
    );
    await act(async () => fireEvent.click(await findByRole('button', { name: 'Next' })));

    // Here skip Completed sentence step

    // State or federal
    await act(async () =>
      fireEvent.click(await findByRole('radio', { name: text[StateFederal.federal] })),
    );
    await act(async () => fireEvent.click(await findByRole('button', { name: 'Next' })));

    await fillStepsForAllClients(findByRole);

    expect(createClient).toBeCalledWith(
      expect.objectContaining({
        veteranOrJustice: [VeteranOrJustice.justiceImpacted],
        releasedAt: ReleasedAt.notCompleted,
        expectedReleasedAt: `${new Date().getFullYear() + 1}-10-10`,
        facility: 'Chippewa Valley Correctional Treatment Facility',
        releasedCounty: 'Adams',
      }),
    );
    expect(dispatch).toBeCalled();
  }, 20000);

  test("show veteran steps if 'Veteran' chosen on Veteran or Justice Impacted step", async () => {
    const [createClient] = mockThunks(actions, ['createClient']);
    const { findByRole, findAllByRole, queryByText, dispatch } = render(<CreateProfilePage />, {
      initialState: { ...mockState, auth: { user: { ...fixtures.user, client: undefined } } },
    });

    // Veteran or Justice Impacted step
    await act(async () =>
      fireEvent.click(await findByRole('checkbox', { name: text[VeteranOrJustice.veteran] })),
    );
    await act(async () => fireEvent.click(await findByRole('button', { name: 'Save & Next' })));

    expect(queryByText('Branch of Service')).toBeInTheDocument();

    // Branch of Service step
    await act(async () =>
      fireEvent.click(await findByRole('checkbox', { name: text[VeteranBranchOfService.usArmy] })),
    );
    await act(async () => fireEvent.click(await findByRole('button', { name: 'Save & Next' })));

    // Member of the Reserves or National Guard step
    await act(async () => fireEvent.click(await findByRole('radio', { name: 'No' })));
    await act(async () => fireEvent.click(await findByRole('button', { name: 'Save & Next' })));

    // Campaigns of Service step
    await act(async () =>
      fireEvent.click(await findByRole('checkbox', { name: text[VeteranCampaign.bosnia] })),
    );
    await act(async () => fireEvent.click(await findByRole('button', { name: 'Save & Next' })));

    // Dates of Service step
    await userEvent.selectOptions((await findAllByRole('combobox'))[0], 'January');
    await userEvent.selectOptions((await findAllByRole('combobox'))[1], '2000');
    await userEvent.selectOptions((await findAllByRole('combobox'))[2], 'January');
    await userEvent.selectOptions((await findAllByRole('combobox'))[3], '2005');
    await act(async () => fireEvent.click(await findByRole('button', { name: 'Save & Next' })));

    // Type of Discharge step
    await userEvent.selectOptions(await findByRole('combobox'), text[VeteranTypeDischarge.bcd]);
    await act(async () => fireEvent.click(await findByRole('button', { name: 'Save & Next' })));

    // Rank at Discharge step
    await userEvent.selectOptions(await findByRole('combobox'), text[VeteranRank.AB]);
    await act(async () => fireEvent.click(await findByRole('button', { name: 'Save & Next' })));

    // DD-214 step
    await act(async () => fireEvent.click(await findByRole('radio', { name: 'No' })));
    await act(async () => fireEvent.click(await findByRole('button', { name: 'Save & Next' })));

    await fillStepsForAllClients(findByRole);

    expect(createClient).toBeCalledWith({
      veteranOrJustice: [VeteranOrJustice.veteran],
      ...partialRequestData,
      veteranService: [VeteranBranchOfService.usArmy],
      veteranRank: VeteranRank.AB,
      veteranStartAt: '2000-1-01',
      veteranEndAt: '2005-1-01',
      veteranReservist: false,
      veteranCampaigns: [VeteranCampaign.bosnia],
      veteranTypeDischarge: VeteranTypeDischarge.bcd,
      veteranDd214: false,
      education: [],
      license: [],
    });
    expect(dispatch).toBeCalled();
  }, 20000);
});
