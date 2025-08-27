import { useForm } from '@disruptive-labs/ui';
import { render, renderHook, waitFor } from '@test';
import { PhoneNumberInput } from '../PhoneNumberInput';

jest.mock('@app/hooks', () => ({
  ...jest.requireActual('@app/hooks'),
  useFormattedPhoneNumber: jest
    .fn()
    .mockImplementationOnce(() => ({
      formatNumber: { reset: jest.fn(), input: (value: string) => value },
      parsePhoneNumber: jest.fn(),
    }))
    .mockImplementationOnce(() => ({
      formatNumber: undefined,
      parsePhoneNumber: undefined,
    })),
}));

describe('PhoneNumberInput', () => {
  test('renders correctly', async () => {
    const { result } = renderHook(() => useForm({ defaultValues: { phone: '' } }));

    const { container, findByText } = render(
      <PhoneNumberInput control={result.current.control} setPhoneValue={jest.fn()} label="Phone" />,
    );

    await waitFor(async () => expect(await findByText('Phone')).toBeInTheDocument());
    expect(container).toMatchSnapshot();
  });

  test('renders correctly when format number package not load', async () => {
    const { result } = renderHook(() => useForm({ defaultValues: { phone: '' } }));

    const { container, findByText } = render(
      <PhoneNumberInput control={result.current.control} setPhoneValue={jest.fn()} label="Phone" />,
    );

    await waitFor(async () => expect(await findByText('Phone')).toBeInTheDocument());
    expect(container).toMatchSnapshot();
  });
});
