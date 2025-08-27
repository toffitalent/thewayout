import { useRouter } from 'next/router';
import { fixtures, render, waitFor } from '@test';
import { CaseManagersListItem } from '../CaseManagersListItem';

const { rspAccountMember } = fixtures;

describe('CaseManagersListItem', () => {
  let push: jest.Mock;

  beforeEach(() => {
    push = jest.fn();
    (useRouter as jest.Mock).mockImplementation(() => ({
      push: jest.fn(),
    }));
  });

  test('renders correctly', async () => {
    const { container, findByText } = render(
      <CaseManagersListItem {...rspAccountMember} caseLoad={1} />,
    );
    await waitFor(async () =>
      expect(
        await findByText(`${rspAccountMember.firstName} ${rspAccountMember.lastName}`),
      ).toBeInTheDocument(),
    );
    expect(container).toMatchSnapshot();
  });
});
