import { useWizardContext } from '@disruptive-labs/ui';
import userEvent from '@testing-library/user-event';
import { render, waitFor } from '@test';
import { steps } from '../../../profileData';
import { StepsClient } from '../../../profileDataTypes';
import { CustomStepLanguage } from '../CustomStepLanguage';

const languageStep = steps.find((el) => el.id === StepsClient.languages);

jest.mock('@disruptive-labs/ui', () => ({
  ...jest.requireActual('@disruptive-labs/ui'),
  useWizardContext: jest.fn(),
}));

describe('CustomStepLanguage', () => {
  beforeEach(() => {
    (useWizardContext as any).mockImplementation(() => ({
      data: {},
      setData: jest.fn(),
      goTo: jest.fn(),
    }));
  });

  test('renders correctly', async () => {
    const { container, findByText } = render(<CustomStepLanguage {...languageStep} />);
    await waitFor(async () => expect(await findByText('Language')).toBeInTheDocument());
    expect(container).toMatchSnapshot();
  });

  test('skip step', async () => {
    const next = jest.fn();
    (useWizardContext as any).mockImplementation(() => ({
      data: {
        languages: [],
      },
      setData: jest.fn(),
      next,
    }));
    const { container, getByText } = render(<CustomStepLanguage {...languageStep} />);
    await userEvent.click(getByText('Skip'));
    expect(next).toBeCalled();
    expect(container).toMatchSnapshot();
  });

  test('press next & save button', async () => {
    const next = jest.fn();
    const setData = jest.fn();
    (useWizardContext as any).mockImplementation(() => ({
      data: {
        languages: [],
      },
      setData,
      next,
    }));
    const { container, getByText } = render(<CustomStepLanguage {...languageStep} />);
    const selectLang = container.querySelector('select[name=language]');
    if (selectLang) {
      userEvent.selectOptions(selectLang, 'english');
    }
    const selectLevel = container.querySelector('select[name=level]');
    if (selectLevel) {
      userEvent.selectOptions(selectLevel, 'elementary');
    }
    await waitFor(() => expect(getByText('Save & Next')).not.toBeDisabled());
    await userEvent.click(getByText('Save & Next'));
    expect(setData).toBeCalledWith({ languages: [{ language: 'english', level: 'elementary' }] });

    await userEvent.click(getByText('Save & Next'));
    expect(next).toBeCalled();
    expect(container).toMatchSnapshot();
  });
});
