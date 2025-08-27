import { useWizardContext } from '@disruptive-labs/ui';
import { render, waitFor } from '@test';
import { CustomStepResponsibilities } from '../CustomStepResponsibility';

jest.mock('@disruptive-labs/ui', () => ({
  ...jest.requireActual('@disruptive-labs/ui'),
  useWizardContext: jest.fn(),
}));

describe('CustomStepResponsibilities', () => {
  beforeEach(() => {
    (useWizardContext as any).mockImplementation(() => ({
      data: {
        responsibilities: [],
      },
      setData: jest.fn(),
      goTo: jest.fn(),
    }));
  });

  test('renders correctly', async () => {
    const { container, findByPlaceholderText } = render(<CustomStepResponsibilities />);
    await waitFor(async () =>
      expect(
        await findByPlaceholderText(
          'E.g. Always be ready to assist customers with menu options and payment.',
        ),
      ).toBeInTheDocument(),
    );
    expect(container).toMatchSnapshot();
  });
});
