import userEvent from '@testing-library/user-event';
import { useRouter } from 'next/router';
import { render } from '@test';
import SignupPage from '../signup.page';

describe('SignupPage', () => {
  let push: jest.Mock;

  beforeEach(() => {
    push = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ push, query: {} });
  });

  test('renders correctly', () => {
    const { container } = render(<SignupPage />);
    expect(container).toMatchSnapshot();
  });

  test('calls router push when clicked job seekers sign up button', async () => {
    const { findAllByRole } = render(<SignupPage />);

    await userEvent.click((await findAllByRole('button'))[0]);
    expect(push).toBeCalledWith('/client/signup');
  });

  test('calls router push when clicked employers sign up button', async () => {
    const { findAllByRole } = render(<SignupPage />);

    await userEvent.click((await findAllByRole('button'))[1]);
    expect(push).toBeCalledWith('/employer/signup');
  });

  test('calls router push when clicked log in button', async () => {
    const { findByText } = render(<SignupPage />);

    await userEvent.click(await findByText('Already using The Way Out?'));
    expect(push).toBeCalledWith({ pathname: '/login' });
  });
});
