import { useWizardContext } from '@disruptive-labs/ui';
import userEvent from '@testing-library/user-event';
import { render } from '@test';
import { steps } from '../../../profileData';
import { StepsClient } from '../../../profileDataTypes';
import { CustomStepLicense } from '../CustomStepLicense';

jest.mock('@disruptive-labs/ui', () => ({
  ...jest.requireActual('@disruptive-labs/ui'),
  useWizardContext: jest.fn(),
}));
const licenseStep = steps.find((el) => el.id === StepsClient.license);

describe('CustomStepLicense', () => {
  beforeEach(() => {
    (useWizardContext as any).mockImplementation(() => ({
      data: {},
      setData: jest.fn(),
      goTo: jest.fn(),
    }));
  });

  test('renders correctly', async () => {
    const { container } = render(<CustomStepLicense fields={licenseStep?.fields || []} />);
    expect(container).toMatchSnapshot();
  });

  test('skip step', async () => {
    const next = jest.fn();
    (useWizardContext as any).mockImplementation(() => ({
      data: {
        license: [],
      },
      setData: jest.fn(),
      next,
    }));
    const { container, getByText } = render(<CustomStepLicense {...licenseStep} />);
    await userEvent.click(getByText('Skip'));
    expect(next).toBeCalled();
    expect(container).toMatchSnapshot();
  });

  test('press next & save button', async () => {
    const next = jest.fn();
    const setData = jest.fn();
    (useWizardContext as any).mockImplementation(() => ({
      data: {
        license: [],
      },
      setData,
      next,
    }));
    const { container, getByText } = render(<CustomStepLicense {...licenseStep} />);
    const inputName = container.querySelector(`input[name="licenseName"]`);
    if (inputName) {
      await userEvent.type(inputName, 'name', { delay: 1 });
    }
    const inputOrg = container.querySelector(`input[name="issuingOrganization"]`);
    if (inputOrg) {
      await userEvent.type(inputOrg, 'org', { delay: 1 });
    }
    const issueAtMonth = container.querySelector('select[name=issueAtMonth]');
    if (issueAtMonth) {
      userEvent.selectOptions(issueAtMonth, '1');
    }
    const issueAtYear = container.querySelector('select[name=issueAtYear]');
    if (issueAtYear) {
      userEvent.selectOptions(issueAtYear, '2021');
    }
    const expirationAtMonth = container.querySelector('select[name=expirationAtMonth]');
    if (expirationAtMonth) {
      userEvent.selectOptions(expirationAtMonth, '1');
    }
    const expirationAtYear = container.querySelector('select[name=expirationAtYear]');
    if (expirationAtYear) {
      userEvent.selectOptions(expirationAtYear, '2029');
    }
    await userEvent.click(getByText('Save & Next'));
    expect(setData).toBeCalledWith({
      license: [
        {
          licenseName: 'name',
          issuingOrganization: 'org',
          issueAtMonth: '1',
          issueAtYear: '2021',
          expirationAtMonth: '1',
          expirationAtYear: '2029',
        },
      ],
    });

    await userEvent.click(getByText('Save & Next'));
    expect(next).toBeCalled();
    expect(container).toMatchSnapshot();
  });
});
