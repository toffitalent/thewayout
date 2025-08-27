import { fixtures, render } from '@test';
import { JobPreview } from '../JobPreview';

describe('JobPreview', () => {
  test('renders correctly', async () => {
    const { container } = render(
      <JobPreview job={fixtures.job} isApplied={false} handleApply={jest.fn} />,
    );

    expect(container).toMatchSnapshot();
  });
});
