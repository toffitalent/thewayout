import { render } from '@test';
import { HowItWorks, HowItWorksType } from '../HowItWorks';

describe('HowItWorks', () => {
  test('renders correctly for job seeker', () => {
    const { container } = render(<HowItWorks type={HowItWorksType.jobSeeker} />);
    expect(container).toMatchSnapshot();
  });

  test('renders correctly for employer', () => {
    const { container } = render(<HowItWorks type={HowItWorksType.employer} />);
    expect(container).toMatchSnapshot();
  });

  test('renders correctly for service providers', () => {
    const { container } = render(<HowItWorks type={HowItWorksType.serviceProviders} />);
    expect(container).toMatchSnapshot();
  });
});
