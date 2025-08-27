import { useWizardContext } from '@disruptive-labs/ui';
import { render } from '@test';
import { Steps, steps } from '../createJobData';
import { CustomStepSalary, CustomStepSalaryProps } from '../CustomStepSalary';

jest.mock('@disruptive-labs/ui', () => ({
  ...jest.requireActual('@disruptive-labs/ui'),
  useWizardContext: jest.fn(),
}));

describe('CustomStepSalary', () => {
  beforeEach(() => {
    (useWizardContext as any).mockImplementation(() => ({
      data: {},
      setData: jest.fn(),
      goTo: jest.fn(),
    }));
  });

  test('renders correctly', async () => {
    const salaryStep = steps.find((el) => el.id === Steps.pay);

    const { container, findByText } = render(
      <CustomStepSalary fields={(salaryStep as CustomStepSalaryProps)?.fields || []} />,
    );
    expect(await findByText('Salary')).toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });
});
