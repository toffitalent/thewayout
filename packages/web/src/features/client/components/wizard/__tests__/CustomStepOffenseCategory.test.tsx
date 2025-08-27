import { useWizardContext } from '@disruptive-labs/ui';
import userEvent from '@testing-library/user-event';
import { render } from '@test';
import { steps } from '../../../profileData';
import { StepsClient } from '../../../profileDataTypes';
import {
  CustomStepOffenseCategory,
  CustomStepOffenseCategoryProps,
} from '../CustomStepOffenseCategory';

jest.mock('@disruptive-labs/ui', () => ({
  ...jest.requireActual('@disruptive-labs/ui'),
  useWizardContext: jest.fn(),
}));
const offenseStep = steps.find((el) => el.id === StepsClient.offenseCategory);

describe('CustomStepOffenseCategory', () => {
  beforeEach(() => {
    (useWizardContext as any).mockImplementation(() => ({
      data: {},
      goTo: jest.fn(),
    }));
  });

  test('renders correctly', async () => {
    const { container } = render(
      <CustomStepOffenseCategory
        fields={(offenseStep as CustomStepOffenseCategoryProps).fields || []}
      />,
    );
    expect(container).toMatchSnapshot();
  });

  test('press next & save button', async () => {
    const next = jest.fn();
    (useWizardContext as any).mockImplementation(() => ({
      data: {
        offenseDrugs: [],
        offenseMotorVehicle: [],
      },
      next,
    }));
    const { container, getByText } = render(
      <CustomStepOffenseCategory {...(offenseStep as CustomStepOffenseCategoryProps)} />,
    );
    await userEvent.click(getByText('DUI and/or DWI'));
    await userEvent.click(getByText('Possession'));
    await userEvent.click(getByText('Save & Next'));
    expect(next).toBeCalledWith({
      offenseDrugs: ['possession'],
      offenseMotorVehicle: ['diuDwi'],
      offensePropertyDamage: [],
      offenseSexual: [],
      offenseTheft: [],
      offenseViolent: [],
      offenseWhiteCollar: [],
    });
    expect(container).toMatchSnapshot();
  });
});
