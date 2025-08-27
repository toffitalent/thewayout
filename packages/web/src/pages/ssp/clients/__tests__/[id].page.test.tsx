import { useRouter } from 'next/router';
import { UserType } from '@two/shared';
import { useAppAuth } from '@app/hooks';
import { fixtures, mockState, render } from '@test';
import ClientPageWithLayout from '../[id].page';

jest.mock('@app/hooks', () => ({
  ...jest.requireActual('@app/hooks'),
  useAppAuth: jest.fn(),
}));

const { rspClient, rspAccountOwner } = fixtures;

describe('ClientPageWithLayout', () => {
  beforeEach(() => {
    (useRouter as jest.Mock).mockImplementation(() => ({
      isReady: true,
      query: { id: String(rspClient.id) },
      push: jest.fn(),
    }));
    (useAppAuth as any).mockImplementation(() => ({
      error: undefined,
      isAuthenticated: false,
      isLoading: false,
      user: {
        roles: [UserType.Rsp],
      },
    }));
  });

  test('renders correctly', async () => {
    const { container } = render(<ClientPageWithLayout />, {
      initialState: {
        ...mockState,
        auth: {
          user: { rspAccount: rspAccountOwner },
        },
      },
    });
    expect(container).toMatchSnapshot();
  });
});
