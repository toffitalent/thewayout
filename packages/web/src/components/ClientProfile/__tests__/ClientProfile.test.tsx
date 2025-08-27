import { UserType } from '@two/shared';
import { fixtures, render } from '@test';
import { ClientProfile } from '../ClientProfile';

describe('ClientProfile', () => {
  test('renders correctly for employer', () => {
    const { container, queryByText, queryByTestId } = render(
      <ClientProfile client={fixtures.client} type={UserType.Employer} />,
    );
    expect(queryByText('Offense History')).not.toBeInTheDocument();
    expect(queryByText('Support Needed')).not.toBeInTheDocument();
    expect(queryByTestId('cloaked')).not.toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });

  test('renders correctly for rsp', () => {
    const { container, queryByText, queryByTestId } = render(
      <ClientProfile client={fixtures.client} type={UserType.Rsp} />,
    );
    expect(queryByText('Offense History')).toBeInTheDocument();
    expect(queryByText('Support Needed')).toBeInTheDocument();
    expect(queryByTestId('cloaked')).not.toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });

  test('renders correctly for client', () => {
    const { container, queryByText, queryByTestId } = render(
      <ClientProfile client={fixtures.client} type={UserType.Client} />,
    );
    expect(queryByText('Offense History')).toBeInTheDocument();
    expect(queryByText('Support Needed')).toBeInTheDocument();
    expect(queryByTestId('cloaked')).toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });
});
