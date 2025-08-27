import { render } from '@test';
import { Testimonial } from '../Testimonial';

describe('Testimonial', () => {
  test('renders correctly', () => {
    const { container } = render(
      <Testimonial
        author="Test Author"
        title=" Test title"
        body="Test Content"
        image={{ src: '/test-file' } as any}
      />,
    );
    expect(container).toMatchSnapshot();
  });
});
