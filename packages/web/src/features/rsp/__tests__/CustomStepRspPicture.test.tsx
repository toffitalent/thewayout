import { useWizardContext } from '@disruptive-labs/ui';
import { render, waitFor } from '@test';
import { CustomStepRspPicture } from '../CustomStepRspPicture';

jest.mock('@disruptive-labs/ui', () => ({
  ...jest.requireActual('@disruptive-labs/ui'),
  useWizardContext: jest.fn(),
}));

describe('CustomStepRspPicture', () => {
  beforeEach(() => {
    (useWizardContext as any).mockImplementation(() => ({
      setData: jest.fn(),
      goTo: jest.fn(),
      data: { avatarRspUrl: 'test' },
    }));
  });

  test('renders correctly', async () => {
    const { container, findByText } = render(<CustomStepRspPicture />);

    expect(container).toMatchSnapshot();
  });
});
