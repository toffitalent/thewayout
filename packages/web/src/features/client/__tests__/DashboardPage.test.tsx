import userEvent from '@testing-library/user-event';
import { useRouter } from 'next/router';
import React from 'react';
import { useIsTablet } from '@app/hooks';
import { fixtures, mockState, render, waitFor } from '@test';
import { DashboardPage, MyJobListItem } from '../DashboardPage';

jest.mock('@app/hooks', () => ({
  ...jest.requireActual('@app/hooks'),
  useIsTablet: jest.fn(),
}));

const mockedUseIsTablet = jest.mocked(useIsTablet);

describe('DashboardPage', () => {
  test('renders correctly', async () => {
    (useRouter as jest.Mock).mockImplementation(() => ({
      events: { on: jest.fn(), off: jest.fn() },
    }));
    const testDate = fixtures.job.createdAt;
    jest.spyOn(global, 'Date').mockImplementation(() => testDate);
    Date.now = jest.fn(() => testDate.valueOf());

    mockedUseIsTablet.mockReturnValue(true);
    const { container } = await waitFor(() => render(<DashboardPage />));
    expect(container).toMatchSnapshot();
  });

  test('calls router.push when clicked list item', async () => {
    const push = jest.fn();
    (useRouter as jest.Mock).mockImplementation(() => ({
      push,
      events: { on: jest.fn(), off: jest.fn() },
    }));
    const { findAllByText } = render(<DashboardPage />);

    await userEvent.click((await findAllByText(fixtures.job.title))[0]);
    expect(push).toBeCalledWith(`/client/jobs/${fixtures.job.id}/`);
  });

  test('renders correctly for veteran client', async () => {
    const initialState = {
      ...mockState,
      auth: {
        user: {
          ...fixtures.user,
          client: fixtures.veteranClient,
        },
      },
    };
    const { container, findByText } = await waitFor(() =>
      render(<DashboardPage />, { initialState }),
    );
    expect(await findByText('US VETERAN 🇺🇸')).toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });
});

describe('MyJobListItem', () => {
  test('renders correctly', async () => {
    mockedUseIsTablet.mockReturnValue(true);
    const { container } = await waitFor(() =>
      render(<MyJobListItem {...fixtures.job} onClick={jest.fn()} />),
    );
    expect(container).toMatchSnapshot();
  });

  test('calls onClick when clicked', async () => {
    const onClick = jest.fn();
    const { findByText } = render(<MyJobListItem {...fixtures.job} onClick={onClick} />);

    await userEvent.click(await findByText(fixtures.job.title));
    expect(onClick).toBeCalledWith(fixtures.job.id);
  });
});
