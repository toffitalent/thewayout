import { useWizardContext } from '@disruptive-labs/ui';
import userEvent from '@testing-library/user-event';
import { act, fixtures, mockState, render, waitFor } from '@test';
import { CustomStepReentryPipeline } from '../CustomStepReentryPipeline';

jest.mock('@disruptive-labs/ui', () => ({
  ...jest.requireActual('@disruptive-labs/ui'),
  useWizardContext: jest.fn(),
}));

describe('CustomStepReentryPipeline', () => {
  let next: jest.Mock;

  beforeEach(() => {
    next = jest.fn();

    (useWizardContext as any).mockImplementation(() => ({
      data: {},
      goTo: jest.fn(),
      next,
    }));
  });

  test('renders correctly', async () => {
    const { container } = render(<CustomStepReentryPipeline />);
    expect(container).toMatchSnapshot();
  });

  test('press next & save button', async () => {
    const { container, getByText } = render(<CustomStepReentryPipeline />);
    await userEvent.click(getByText(fixtures.rsp.name));
    await userEvent.click(getByText('Next'));
    expect(next).toBeCalledWith({ rspId: fixtures.rsp.id });
    expect(container).toMatchSnapshot();
  });

  test('next button enabled if list of rsp is empty', async () => {
    const { getByText, findByRole } = render(<CustomStepReentryPipeline />, {
      initialState: {
        ...mockState,
        clientJobs: { rspList: { ids: [], entities: {} } },
      },
    });
    expect(getByText('Next')).toBeEnabled();
    await userEvent.click(getByText('Next'));
    await act(async () => userEvent.click(await findByRole('button', { name: 'Confirm' })));
    expect(next).toBeCalledWith({ rspId: undefined });
  });

  test('opens confirmation modal if no rsp selected', async () => {
    const { getByText, findByRole, queryByText } = render(<CustomStepReentryPipeline />);

    await userEvent.click(getByText('Next'));
    expect(queryByText('No Supportive Services Provider (SSP) Selected')).toBeInTheDocument();
    await act(async () => userEvent.click(await findByRole('button', { name: 'Cancel' })));
    expect(queryByText('No Supportive Services Provider (SSP) Selected')).not.toBeInTheDocument();
  });
});
