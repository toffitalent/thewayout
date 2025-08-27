import userEvent from '@testing-library/user-event';
import { StatCategory, VeteranOrJustice } from '@two/shared';
import * as actions from '@app/features/rsp/actions';
import { createState, fixtures, mockThunks, render, waitFor } from '@test';
import { ReportsPage } from '../ReportsPage';

const { rspAccountOwner, rspClient, rspClient2, rsp } = fixtures;

const initialState = createState({
  auth: {
    user: { rspAccount: rspAccountOwner },
  },
});

describe('ReportsPage', () => {
  test('renders correctly', async () => {
    const { container, findByText, findByRole } = render(<ReportsPage />, { initialState });
    await waitFor(async () => expect(await findByText('Reports')).toBeInTheDocument());
    expect(
      (await findByRole('tab', { name: 'Offense' })).className.includes('display-none'),
    ).toBeFalsy();
    expect(
      (await findByRole('tab', { name: 'State / Federal' })).className.includes('display-none'),
    ).toBeFalsy();
    expect(
      (await findByRole('tab', { name: 'Release' })).className.includes('display-none'),
    ).toBeFalsy();

    expect(container).toMatchSnapshot();
  });

  test('gets filtered list when option is selected', async () => {
    const [getStatistics, listStatisticsClients] = mockThunks(actions, [
      'getStatistics',
      'listStatisticsClients',
    ]);

    const { queryByText, findByText } = render(<ReportsPage />, { initialState });

    expect(queryByText(rspClient.user.email!)).toBeInTheDocument();
    expect(queryByText(rspClient2.user.email!)).toBeInTheDocument();
    expect(getStatistics).toBeCalledWith({
      rspId: rspAccountOwner.rspId,
      category: StatCategory.services,
    });

    await userEvent.click(await findByText('Clothing'));
    expect(listStatisticsClients).toBeCalledWith({
      rspId: rspAccountOwner.rspId,
      support: 'clothing',
      forceReload: true,
    });

    expect(queryByText(rspClient.user.email!)).not.toBeInTheDocument();
    expect(queryByText(rspClient2.user.email!)).toBeInTheDocument();
  });

  test('gets new statistics when the tab changes', async () => {
    const [getStatistics] = mockThunks(actions, ['getStatistics']);

    const { findByRole } = render(<ReportsPage />, {
      initialState: {
        ...initialState,
        rsp: {
          ...initialState.rsp,
          statistic: {
            result: {
              female: 4,
              genderFluid: 0,
              intersex: 0,
              male: 1,
              nonBinary: 0,
              preferNotToSay: 1,
              transgender: 0,
            },
            total: 6,
          },
        },
      },
    });

    await userEvent.click(await findByRole('tab', { name: 'Gender' }));
    expect(getStatistics).toBeCalledWith({
      rspId: rspAccountOwner.rspId,
      category: StatCategory.gender,
    });
  });

  test('hides related to justice impacted tabs when organization not allowed those applicants', async () => {
    const initialState = createState({
      auth: {
        user: {
          rspAccount: {
            ...rspAccountOwner,
            rsp: { ...rsp, veteranOrJustice: [VeteranOrJustice.veteran] },
          },
        },
      },
    });

    const { container, findByRole } = render(<ReportsPage />, { initialState });

    expect(
      (await findByRole('tab', { name: 'Offense' })).className.includes('display-none'),
    ).toBeTruthy();
    expect(
      (await findByRole('tab', { name: 'State / Federal' })).className.includes('display-none'),
    ).toBeTruthy();
    expect(
      (await findByRole('tab', { name: 'Release' })).className.includes('display-none'),
    ).toBeTruthy();

    expect(container).toMatchSnapshot();
  });
});
