import { useWizardContext } from '@disruptive-labs/ui';
import userEvent from '@testing-library/user-event';
import { render } from '@test';
import { steps } from '../../../profileData';
import { StepsClient } from '../../../profileDataTypes';
import { CustomStepEducation } from '../CustomStepEducation';

jest.mock('@disruptive-labs/ui', () => ({
  ...jest.requireActual('@disruptive-labs/ui'),
  useWizardContext: jest.fn(),
}));

const educationStep = steps.find((el) => el.id === StepsClient.education);

describe('CustomStepEducation', () => {
  beforeEach(() => {
    (useWizardContext as any).mockImplementation(() => ({
      data: {},
      setData: jest.fn(),
      goTo: jest.fn(),
    }));
  });

  test('renders correctly', async () => {
    const { container } = render(<CustomStepEducation fields={educationStep?.fields || []} />);
    expect(container).toMatchSnapshot();
  });

  test('skip step', async () => {
    const next = jest.fn();
    (useWizardContext as any).mockImplementation(() => ({
      data: {
        education: [],
      },
      setData: jest.fn(),
      next,
    }));
    const { container, getByText } = render(<CustomStepEducation {...educationStep} />);
    await userEvent.click(getByText('Skip'));
    expect(next).toBeCalled();
    expect(container).toMatchSnapshot();
  });

  test('press next & save button', async () => {
    const next = jest.fn();
    const setData = jest.fn();

    (useWizardContext as any).mockImplementation(() => ({
      data: {
        education: [],
      },
      setData,
      next,
    }));
    const { container, getByText } = render(<CustomStepEducation {...educationStep} />);
    const schoolIssuer = container.querySelector(`input[name="schoolIssuer"]`);
    if (schoolIssuer) {
      await userEvent.type(schoolIssuer, 'schoolIssuer', { delay: 1 });
    }
    const degree = container.querySelector(`input[name="degree"]`);
    if (degree) {
      await userEvent.type(degree, 'degree', { delay: 1 });
    }
    const areaOfStudy = container.querySelector(`input[name="areaOfStudy"]`);
    if (areaOfStudy) {
      await userEvent.type(areaOfStudy, 'areaOfStudy', { delay: 1 });
    }

    const description = container.querySelector(`textarea[name="description"]`);
    if (description) {
      await userEvent.type(description, 'description', { delay: 1 });
    }

    const startYear = container.querySelector('select[name=startYear]');
    if (startYear) {
      userEvent.selectOptions(startYear, '2020');
    }
    const yearEarned = container.querySelector('select[name=yearEarned]');
    if (yearEarned) {
      userEvent.selectOptions(yearEarned, '2021');
    }

    await userEvent.click(getByText('Save & Next'));
    expect(setData).toBeCalledWith({
      education: [
        {
          schoolIssuer: 'schoolIssuer',
          degree: 'degree',
          areaOfStudy: 'areaOfStudy',
          startYear: '2020',
          yearEarned: '2021',
          description: 'description',
        },
      ],
    });

    await userEvent.click(getByText('Save & Next'));
    expect(next).toBeCalled();
    expect(container).toMatchSnapshot();
  });
});
