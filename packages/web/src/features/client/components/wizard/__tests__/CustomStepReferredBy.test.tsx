import { useWizardContext } from '@disruptive-labs/ui';
import userEvent from '@testing-library/user-event';
import { render, waitFor } from '@test';
import { steps } from '../../../profileData';
import { StepsClient } from '../../../profileDataTypes';
import { CustomStepReferredBy, CustomStepReferredByProps } from '../CustomStepReferredBy';

jest.mock('@disruptive-labs/ui', () => ({
  ...jest.requireActual('@disruptive-labs/ui'),
  useWizardContext: jest.fn(),
}));
const referredByStep = steps.find((el) => el.id === StepsClient.referredBy);

describe('CustomStepReferredBy', () => {
  beforeEach(() => {
    (useWizardContext as any).mockImplementation(() => ({
      data: {},
      goTo: jest.fn(),
    }));
  });

  test('renders correctly', async () => {
    const { container, findByText } = render(
      <CustomStepReferredBy fields={(referredByStep as CustomStepReferredByProps).fields || []} />,
    );
    await waitFor(async () =>
      expect(await findByText('Case Manager / Reentry Service Provider')).toBeInTheDocument(),
    );
    expect(container).toMatchSnapshot();
  });

  test('press next & save button', async () => {
    const next = jest.fn();
    (useWizardContext as any).mockImplementation(() => ({
      data: {
        referredBy: '',
      },
      next,
    }));
    const { container, getByText } = render(
      <CustomStepReferredBy {...(referredByStep as CustomStepReferredByProps)} />,
    );
    await userEvent.click(getByText('Newsletter'));
    await userEvent.click(getByText('Submit'));
    expect(next).toBeCalledWith({ referredBy: 'newsletter' });
    expect(container).toMatchSnapshot();
  });
});
