import { fixtures, render } from '@test';
import { ListItem } from '../ListItem';

const { job } = fixtures;

describe('ListItem', () => {
  test('renders correctly', async () => {
    const { container } = render(<ListItem {...job} createdAt={new Date()} onClick={jest.fn()} />);
    expect(container).toMatchSnapshot();
  });
});
