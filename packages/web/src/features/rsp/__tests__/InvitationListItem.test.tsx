import { fixtures, render, waitFor } from '@test';
import { InvitationListItem } from '../InvitationListItem';

const { invitation } = fixtures;

describe('InvitationListItem', () => {
  test('renders correctly', async () => {
    const { container, findByText } = render(<InvitationListItem {...invitation} />);
    await waitFor(async () =>
      expect(
        await findByText(`${invitation.firstName} ${invitation.lastName}`),
      ).toBeInTheDocument(),
    );
    expect(container).toMatchSnapshot();
  });
});
