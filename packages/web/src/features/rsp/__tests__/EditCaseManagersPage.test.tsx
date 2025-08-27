import userEvent from '@testing-library/user-event';
import { useRouter } from 'next/router';
import { act, fireEvent, fixtures, mockState, mockThunks, render, screen, waitFor } from '@test';
import * as actions from '../actions';
import { EditCaseManagerPage } from '../EditCaseManagerPage';

const { rspAccountMember, user, rspAccountOwner } = fixtures;

describe('EditCaseManagerPage', () => {
  beforeEach(() => {
    (useRouter as jest.Mock).mockImplementation(() => ({
      query: { id: String(rspAccountMember.id) },
    }));
  });

  test('renders correctly', async () => {
    const { container, findByText } = render(<EditCaseManagerPage />);
    await waitFor(async () => expect(await findByText('Personal Information')).toBeInTheDocument());
    expect(container).toMatchSnapshot();
  });
});
