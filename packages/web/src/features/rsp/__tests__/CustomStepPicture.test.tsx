import { useWizardContext } from '@disruptive-labs/ui';
import { render } from '@test';
import { CustomStepPicture } from '../CustomStepPicture';

jest.mock('@disruptive-labs/ui', () => ({
  ...jest.requireActual('@disruptive-labs/ui'),
  useWizardContext: jest.fn(),
}));

describe('CustomStepPicture', () => {
  beforeEach(() => {
    (useWizardContext as any).mockImplementation(() => ({
      setData: jest.fn(),
      goTo: jest.fn(),
      data: { avatarUrl: 'test' },
    }));
  });

  test('renders correctly', async () => {
    const { container } = render(<CustomStepPicture nextButtonLabel="Save & Next" />);

    expect(container).toMatchSnapshot();
  });
});
