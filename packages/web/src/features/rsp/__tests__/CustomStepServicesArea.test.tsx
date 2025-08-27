import { useWizardContext } from '@disruptive-labs/ui';
import userEvent from '@testing-library/user-event';
import { act, fireEvent, render, waitFor } from '@test';
import { CustomStepServicesArea } from '../CustomStepServicesArea';

const fields = [
  {
    name: 'servicesArea',
    type: 'text',
    label: 'Search Area',
  },
];
jest.mock('@disruptive-labs/ui', () => ({
  ...jest.requireActual('@disruptive-labs/ui'),
  useWizardContext: jest.fn(),
}));

describe('CustomStepServicesArea', () => {
  beforeEach(() => {
    (useWizardContext as any).mockImplementation(() => ({
      data: {},
      setData: jest.fn(),
      goTo: jest.fn(),
    }));
  });

  test('renders correctly', async () => {
    const { container, getAllByLabelText } = render(
      <CustomStepServicesArea fields={fields as any} />,
    );

    await waitFor(async () => expect(getAllByLabelText('Search Area')[0]).toBeInTheDocument());
    expect(container).toMatchSnapshot();
  });

  test('renders list', async () => {
    const { container, getAllByLabelText } = render(
      <CustomStepServicesArea fields={fields as any} />,
    );

    await userEvent.type(getAllByLabelText('Search Area')[0], 'W');

    expect(container).toMatchSnapshot();
  });

  test('renders chosen options', async () => {
    const { container, getAllByLabelText, findByRole, findByText } = render(
      <CustomStepServicesArea fields={fields as any} />,
    );

    await userEvent.type(getAllByLabelText('Search Area')[0], 'W');
    await act(async () => fireEvent.click(await findByRole('option', { name: 'Washington' })));

    expect(
      (await findByRole('combobox', { name: 'Search Area' })).getAttribute('aria-expanded'),
    ).toBe('false');
    expect(await findByText('Selected Service Areas')).toBeInTheDocument();
    expect(await findByText('Washington')).toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });
});
