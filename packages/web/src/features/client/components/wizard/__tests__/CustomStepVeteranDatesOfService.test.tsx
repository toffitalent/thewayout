import { useWizardContext } from '@disruptive-labs/ui';
import userEvent from '@testing-library/user-event';
import { steps } from '@app/features/client/profileData';
import { StepsClient } from '@app/features/client/profileDataTypes';
import { render } from '@test';
import {
  CustomStepProps,
  CustomStepVeteranDatesOfService,
} from '../CustomStepVeteranDatesOfService';

jest.mock('@disruptive-labs/ui', () => ({
  ...jest.requireActual('@disruptive-labs/ui'),
  useWizardContext: jest.fn(),
}));
const step = steps.find((el) => el.id === StepsClient.veteranDates);

describe('CustomStepVeteranDatesOfService', () => {
  beforeEach(() => {
    (useWizardContext as any).mockImplementation(() => ({
      data: {},
    }));
  });

  test('renders correctly', async () => {
    const { container } = render(
      <CustomStepVeteranDatesOfService fields={(step as CustomStepProps)?.fields || []} />,
    );
    expect(container).toMatchSnapshot();
  });

  test('validates dates', async () => {
    const { findAllByRole, findByRole, queryByText } = render(
      <CustomStepVeteranDatesOfService fields={(step as CustomStepProps)?.fields || []} />,
    );
    await userEvent.selectOptions((await findAllByRole('combobox'))[0], 'May');
    await userEvent.selectOptions((await findAllByRole('combobox'))[1], '2010');
    await userEvent.selectOptions((await findAllByRole('combobox'))[2], 'May');
    await userEvent.selectOptions((await findAllByRole('combobox'))[3], '2000');

    expect(queryByText('End date must be after start date')).toBeInTheDocument();
    expect(await findByRole('button')).not.toBeEnabled();

    await userEvent.selectOptions((await findAllByRole('combobox'))[3], '2015');

    expect(queryByText('End date must be after start date')).not.toBeInTheDocument();
    expect(await findByRole('button')).toBeEnabled();
  });

  test('press save & next button', async () => {
    const next = jest.fn();
    (useWizardContext as any).mockImplementation(() => ({
      data: {
        veteranStartAtMonth: '',
        veteranStartAtYear: '',
        veteranEndAtMonth: '',
        veteranEndAtYear: '',
      },
      next,
    }));
    const { findAllByRole, findByRole } = render(
      <CustomStepVeteranDatesOfService fields={(step as CustomStepProps)?.fields || []} />,
    );
    await userEvent.selectOptions((await findAllByRole('combobox'))[0], 'May');
    await userEvent.selectOptions((await findAllByRole('combobox'))[1], '2010');
    await userEvent.selectOptions((await findAllByRole('combobox'))[2], 'May');
    await userEvent.selectOptions((await findAllByRole('combobox'))[3], '2015');

    await userEvent.click(await findByRole('button'));

    expect(next).toBeCalledWith({
      veteranStartAtMonth: '5',
      veteranStartAtYear: '2010',
      veteranEndAtMonth: '5',
      veteranEndAtYear: '2015',
    });
  });
});
