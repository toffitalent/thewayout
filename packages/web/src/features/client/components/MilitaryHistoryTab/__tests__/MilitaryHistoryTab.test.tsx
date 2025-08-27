import userEvent from '@testing-library/user-event';
import {
  VeteranBranchOfService,
  VeteranCampaign,
  VeteranRank,
  VeteranTypeDischarge,
} from '@two/shared';
import { clientProfile } from '@app/data/clientProfileText';
import * as actions from '@app/features/client/actions';
import { fixtures, mockState, mockThunks, render, within } from '@test';
import { MilitaryHistoryTab } from '../MilitaryHistoryTab';

const initialState = {
  ...mockState,
  auth: {
    user: {
      ...fixtures.user,
      client: fixtures.veteranClient,
    },
  },
};

describe('MilitaryHistoryTab', () => {
  test('renders correctly', async () => {
    const { container, findByText } = render(<MilitaryHistoryTab />, { initialState });
    expect(await findByText('Military History')).toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });

  test('handles submission', async () => {
    const [updateClient] = mockThunks(actions, ['updateClient']);
    const { findByRole, findAllByRole } = render(<MilitaryHistoryTab />, { initialState });
    await userEvent.click(
      await findByRole('checkbox', { name: clientProfile[VeteranBranchOfService.usArmy] }),
    );
    await userEvent.selectOptions(
      await findByRole('combobox', { name: 'Rank' }),
      clientProfile[VeteranRank['1LT']],
    );
    await userEvent.selectOptions(await findByRole('combobox', { name: 'End Date' }), 'May');
    await userEvent.selectOptions((await findAllByRole('combobox'))[3], '2010');
    await userEvent.click(
      await within(
        await findByRole('group', { name: 'Member of the Reserves or National Guard' }),
      ).findByRole('radio', { name: 'Yes' }),
    );
    await userEvent.click(
      await findByRole('checkbox', { name: clientProfile[VeteranCampaign.bosnia] }),
    );
    await userEvent.selectOptions(
      await findByRole('combobox', { name: 'Type of Discharge' }),
      clientProfile[VeteranTypeDischarge.bcd],
    );
    await userEvent.click(
      await within(await findByRole('group', { name: 'Copy of DD-214' })).findByRole('radio', {
        name: 'Yes',
      }),
    );

    await userEvent.click(await findByRole('button'));
    expect(updateClient).toBeCalledWith(
      expect.objectContaining({
        veteranService: [VeteranBranchOfService.usAirForce, VeteranBranchOfService.usArmy],
        veteranRank: VeteranRank['1LT'],
        veteranEndAt: '2010-5-01',
        veteranReservist: true,
        veteranCampaigns: [VeteranCampaign.gulfWar, VeteranCampaign.bosnia],
        veteranTypeDischarge: VeteranTypeDischarge.bcd,
        veteranDd214: true,
      }),
    );
  });
});
