import { render } from '@test';
import { ConfirmCreateProfilePage } from '../ConfirmCreateProfilePage';

describe('ConfirmCreateProfilePage', () => {
  test('renders correctly', () => {
    const { container } = render(<ConfirmCreateProfilePage />);
    expect(container).toMatchSnapshot();
  });
});
