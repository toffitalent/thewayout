import { useWizardContext } from '@disruptive-labs/ui';
import userEvent from '@testing-library/user-event';
import { render, waitFor } from '@test';
import { steps } from '../../../profileData';
import { StepsClient } from '../../../profileDataTypes';
import { CustomStepExperience } from '../CustomStepExperience';

jest.mock('@disruptive-labs/ui', () => ({
  ...jest.requireActual('@disruptive-labs/ui'),
  useWizardContext: jest.fn(),
}));
const experienceStep = steps.find((el) => el.id === StepsClient.relativeExperience);

describe('CustomStepExperience', () => {
  beforeEach(() => {
    (useWizardContext as any).mockImplementation(() => ({
      data: {},
      setData: jest.fn(),
      goTo: jest.fn(),
    }));
  });

  test('renders correctly', async () => {
    const { container, findByText } = render(
      <CustomStepExperience fields={experienceStep?.fields || []} />,
    );
    expect(await findByText('Add relative experience')).toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });

  test('skip step', async () => {
    const next = jest.fn();
    (useWizardContext as any).mockImplementation(() => ({
      data: {
        relativeExperience: [],
      },
      setData: jest.fn(),
      next,
    }));
    const { container, getByText } = render(<CustomStepExperience {...experienceStep} />);
    await userEvent.click(getByText('Skip'));
    expect(next).toBeCalled();
    expect(container).toMatchSnapshot();
  });

  test('press next & save button', async () => {
    const next = jest.fn();
    const setData = jest.fn();
    (useWizardContext as any).mockImplementation(() => ({
      data: {
        relativeExperience: [],
      },
      setData,
      next,
    }));
    const { container, getByText } = render(<CustomStepExperience {...experienceStep} />);
    const inputName = container.querySelector(`input[name="title"]`);
    if (inputName) {
      await userEvent.type(inputName, 'title', { delay: 1 });
    }
    const company = container.querySelector(`input[name="company"]`);
    if (company) {
      await userEvent.type(company, 'company', { delay: 1 });
    }
    const location = container.querySelector(`input[name="location"]`);
    if (location) {
      await userEvent.type(location, 'location', { delay: 1 });
    }
    const description = container.querySelector(`textarea[name="description"]`);
    if (description) {
      await userEvent.type(description, 'description', { delay: 1 });
    }
    const startAtMonth = container.querySelector('select[name=startAtMonth]');
    if (startAtMonth) {
      userEvent.selectOptions(startAtMonth, '1');
    }
    const startAtYear = container.querySelector('select[name=startAtYear]');
    if (startAtYear) {
      userEvent.selectOptions(startAtYear, '2020');
    }
    const endAtMonth = container.querySelector('select[name=endAtMonth]');
    if (endAtMonth) {
      userEvent.selectOptions(endAtMonth, '2');
    }
    const endAtYear = container.querySelector('select[name=endAtYear]');
    if (endAtYear) {
      userEvent.selectOptions(endAtYear, '2022');
    }
    await waitFor(() => expect(getByText('Save & Next')).not.toBeDisabled());
    await userEvent.click(getByText('Save & Next'));
    expect(setData).toBeCalledWith({
      relativeExperience: [
        {
          title: 'title',
          company: 'company',
          startAtMonth: '1',
          startAtYear: '2020',
          endAtMonth: '2',
          endAtYear: '2022',
          location: 'location',
          description: 'description',
          stillWork: false,
        },
      ],
    });

    await userEvent.click(getByText('Save & Next'));
    // expect(next).toBeCalled();
    expect(container).toMatchSnapshot();
  });
});
