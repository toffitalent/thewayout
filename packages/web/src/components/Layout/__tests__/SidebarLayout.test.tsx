import { useRouter } from 'next/router';
import { RspRole, UserType } from '@two/shared';
import { mockState, render, waitFor } from '@test';
import { SidebarLayout } from '../SidebarLayout';

describe('SidebarLayout', () => {
  beforeEach(() => {
    (useRouter as jest.Mock).mockImplementation(() => ({
      asPath: '/',
    }));
  });

  test('renders correctly for rsp', async () => {
    const { container, findByText } = render(
      <SidebarLayout type={UserType.Rsp}>
        <div>Page</div>
      </SidebarLayout>,
      {
        initialState: {
          ...mockState,
          auth: {
            user: {
              firstName: 'First',
              lastName: 'Last',
              rspAccount: { rsp: { name: 'Test' }, role: RspRole.owner },
              type: UserType.Rsp,
            },
          },
        },
      },
    );

    await waitFor(async () => expect(await findByText('Clients')).toBeInTheDocument());
    expect(container).toMatchSnapshot();
  });

  test('renders correctly for employer', async () => {
    const { container, findByText } = render(
      <SidebarLayout type={UserType.Employer}>
        <div>Page</div>
      </SidebarLayout>,
      {
        initialState: {
          ...mockState,
          auth: {
            user: {
              firstName: 'First',
              lastName: 'Last',
              employer: { name: 'Test' },
              type: UserType.Employer,
            },
          },
        },
      },
    );

    await waitFor(async () => expect(await findByText('Job Postings')).toBeInTheDocument());
    expect(container).toMatchSnapshot();
  });

  test('renders correctly for client', async () => {
    const { container, findByText } = render(
      <SidebarLayout type={UserType.Client}>
        <div>Page</div>
      </SidebarLayout>,
    );

    await waitFor(async () => expect(await findByText('Dashboard')).toBeInTheDocument());
    expect(container).toMatchSnapshot();
  });
});
