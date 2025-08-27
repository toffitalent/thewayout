import { ToastProvider } from '@disruptive-labs/ui';
import { createStore, Store } from '@reduxjs/toolkit';
import { render, RenderOptions as RTLRenderOptions } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import { createState, reducer } from './state';
import { mockDispatch, MockedDispatch } from './utils';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <ToastProvider />
    </>
  );
}

const mockState = createState();

interface RenderOptions extends Omit<RTLRenderOptions, 'queries'> {
  dispatch?: MockedDispatch;
  initialState?: any;
  store?: Store;
}

function renderWithProviders(
  ui: React.ReactElement,
  {
    dispatch: dispatchProp,
    initialState = mockState,
    store = createStore(reducer, initialState),
    ...renderOptions
  }: RenderOptions = {},
) {
  const storeDispatch = store.dispatch;
  const dispatch = dispatchProp || mockDispatch();
  store.dispatch = dispatch;

  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <Providers>
        <Provider store={store}>{children}</Provider>
      </Providers>
    );
  }

  const res = render(ui, { wrapper: Wrapper, ...renderOptions });

  return { ...res, dispatch, store, storeDispatch };
}

export * from '@testing-library/react';
export { renderWithProviders as render };
export * from './state';
export * from './utils';
export { Providers as wrapper };
