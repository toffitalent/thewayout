import { useWizardContext } from '@disruptive-labs/ui';
import { render, waitFor } from '@test';
import { CustomStepPhone } from '../CustomStepPhone';

jest.mock('@disruptive-labs/ui', () => ({
  ...jest.requireActual('@disruptive-labs/ui'),
  useWizardContext: jest.fn(),
}));

describe('CustomStepPhone', () => {
  beforeEach(() => {
    (useWizardContext as any).mockImplementation(() => ({
      data: {},
      setData: jest.fn(),
      goTo: jest.fn(),
    }));
  });

  test('renders correctly', async () => {
    const { container, findByRole } = render(
      <CustomStepPhone
        fields={[{ name: 'phone', type: 'text', label: 'Phone', placeholder: 'Phone' }]}
      />,
    );

    await waitFor(async () =>
      expect(await findByRole('button', { name: 'Save & Next' })).toBeInTheDocument(),
    );
    expect(container).toMatchSnapshot();
  });
});
