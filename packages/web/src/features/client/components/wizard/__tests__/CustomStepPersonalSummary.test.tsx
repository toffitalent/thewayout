import { useWizardContext } from '@disruptive-labs/ui';
import userEvent from '@testing-library/user-event';
import { CustomStepTextField } from '@app/types';
import { render, waitFor } from '@test';
import { steps } from '../../../profileData';
import { StepsClient } from '../../../profileDataTypes';
import { CustomStepPersonalSummary } from '../CustomStepPersonalSummary';

jest.mock('@disruptive-labs/ui', () => ({
  ...jest.requireActual('@disruptive-labs/ui'),
  useWizardContext: jest.fn(),
}));
const personalSummaryStep = steps.find((el) => el.id === StepsClient.personalSummary);

describe('CustomStepOffenseCategory', () => {
  beforeEach(() => {
    (useWizardContext as any).mockImplementation(() => ({
      data: {},
      goTo: jest.fn(),
    }));
  });

  test('renders correctly', async () => {
    const personalSummaryStep = steps.find((el) => el.id === StepsClient.personalSummary);
    const { container, findByPlaceholderText } = render(
      <CustomStepPersonalSummary
        fields={(personalSummaryStep as CustomStepTextField).fields || []}
      />,
    );
    await waitFor(async () =>
      expect(await findByPlaceholderText('Your summary goes here.')).toBeInTheDocument(),
    );
    expect(container).toMatchSnapshot();
  });

  test('press next & save button', async () => {
    const next = jest.fn();
    (useWizardContext as any).mockImplementation(() => ({
      data: {
        personalSummary: '',
      },
      next,
    }));
    const { container, getByText, getByLabelText } = render(
      <CustomStepPersonalSummary {...(personalSummaryStep as CustomStepTextField)} />,
    );
    const textareaEl = container.querySelector(`textarea[name="personalSummary"]`);
    if (textareaEl) {
      await userEvent.type(textareaEl, 'personalSummary', { delay: 1 });
    }
    await userEvent.click(getByText('Save & Next'));
    expect(next).toBeCalledWith({ personalSummary: 'personalSummary' });
    expect(container).toMatchSnapshot();
  });
});
