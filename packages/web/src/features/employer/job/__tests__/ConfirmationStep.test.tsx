import { useWizardContext } from '@disruptive-labs/ui';
import { fixtures, render } from '@test';
import { ConfirmationStep } from '../ConfirmationStep';

jest.mock('@disruptive-labs/ui', () => ({
  ...jest.requireActual('@disruptive-labs/ui'),
  useWizardContext: jest.fn(),
}));

describe('ConfirmationStep', () => {
  beforeEach(() => {
    (useWizardContext as any).mockImplementation(() => ({
      data: {
        ...fixtures.job,
        startAtMonth: '2',
        startAtYear: '2022',
        ...fixtures.job.salaryOptions,
      },
      setData: jest.fn(),
      goTo: jest.fn(),
    }));
  });

  test('renders correctly', async () => {
    const { container } = render(<ConfirmationStep onSubmit={jest.fn()} />);
    expect(container).toMatchSnapshot();
  });
});
