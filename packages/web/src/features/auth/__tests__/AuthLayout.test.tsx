import React from 'react';
import { render, waitFor } from '@test';
import { AuthLayout } from '../AuthLayout';

describe('AuthLayout', () => {
  test('renders correctly', async () => {
    const { container } = await waitFor(() => render(<AuthLayout>Page Content</AuthLayout>));
    expect(container).toMatchSnapshot();
  });
});
