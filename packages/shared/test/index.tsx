import { ToastProvider } from '@disruptive-labs/ui';
import { render, RenderOptions } from '@testing-library/react';
import React from 'react';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <ToastProvider />
    </>
  );
}

function renderWithProviders(ui: React.ReactElement, renderOptions: RenderOptions = {}) {
  function Wrapper({ children }: { children: React.ReactNode }) {
    return <Providers>{children}</Providers>;
  }

  return render(ui, { wrapper: Wrapper, ...renderOptions });
}

export * from '@testing-library/react';
export { renderWithProviders as render };
export { Providers as wrapper };
