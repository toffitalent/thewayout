import { useRouter } from 'next/router';
import { useAppAuth } from '@app/hooks';
import { act, fireEvent, render, waitFor } from '@test';
import { Header } from '../Header';

jest.mock('@app/hooks', () => ({
  ...jest.requireActual('@app/hooks'),
  useAppAuth: jest.fn(),
}));

describe('Header', () => {
  beforeEach(() => {
    (useRouter as jest.Mock).mockImplementation(() => ({
      events: { on: jest.fn(), off: jest.fn() },
    }));
    (useAppAuth as any).mockImplementation(() => ({
      isAuthenticated: true,
      isLoading: false,
    }));
  });

  test('renders correctly', async () => {
    const { container } = await waitFor(() => render(<Header />));
    expect(container).toMatchSnapshot();
  });

  test('opens menu after clicking on Toggle navigation button', async () => {
    const { container, getByLabelText, findByRole } = await waitFor(() => render(<Header />));

    await act(() => fireEvent.click(getByLabelText('Toggle navigation')));
    expect(await findByRole('banner')).toHaveClass('menuOpen');
    expect(container).toMatchSnapshot();
  });

  test('renders correctly transparent', async () => {
    const { container } = await waitFor(() => render(<Header transparent />));
    expect(container).toMatchSnapshot();
  });
});
