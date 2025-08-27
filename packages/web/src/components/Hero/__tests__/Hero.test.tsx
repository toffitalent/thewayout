import React from 'react';
import { render } from '@test';
import { Hero } from '../Hero';

describe('Hero', () => {
  test('renders correctly', () => {
    const { container } = render(<Hero heading="Heading" subheading="Subheading" />);
    expect(container).toMatchSnapshot();
  });

  test('renders actions', () => {
    const { container } = render(
      <Hero heading="Heading" subheading="Subheading" actions={[{ href: '/', label: 'Action' }]} />,
    );

    expect(container).toMatchSnapshot();
  });

  test('renders image', () => {
    const { container } = render(
      <Hero heading="Heading" subheading="Subheading" image={'/test-image' as any} />,
    );

    expect(container).toMatchSnapshot();
  });
});
