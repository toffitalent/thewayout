import { useRouter } from 'next/router';
import { RspRole, UserType } from '@two/shared';
import { mockState, render, waitFor } from '@test';
import { EmployerSidebar } from '../EmployerSidebar';

describe('EmployerSidebar', () => {
  beforeEach(() => {
    (useRouter as jest.Mock).mockImplementation(() => ({
      asPath: '/',
    }));
  });

  test('renders correctly', async () => {
    const { container, findByText } = render(<EmployerSidebar />, {
      initialState: {
        ...mockState,
        auth: {
          user: { employer: { name: 'Test' }, type: UserType.Employer },
        },
      },
    });

    await waitFor(async () => expect(await findByText('Job Postings')).toBeInTheDocument());
    expect(container).toMatchSnapshot();
  });
});
