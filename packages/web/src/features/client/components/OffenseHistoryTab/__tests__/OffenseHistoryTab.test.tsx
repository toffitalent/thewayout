import { render } from '@test';
import { OffenseHistoryTab } from '../OffenseHistoryTab';

describe('OffenseHistoryTab', () => {
  test('renders correctly', async () => {
    const { container, findByText } = render(<OffenseHistoryTab />);
    expect(await findByText('Current Justice Status')).toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });
});
