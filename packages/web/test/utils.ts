export interface MockedThunk extends jest.Mock<any, any> {
  fulfilled: jest.Mock<any, any> & { match: (action: any) => boolean; type: string };
  pending: jest.Mock<any, any> & { match: (action: any) => boolean; type: string };
  rejected: jest.Mock<any, any> & { match: (action: any) => boolean; type: string };
  typePrefix: string;
}

export function mockThunk(
  mockFn: jest.Mock | jest.SpyInstance,
  typePrefix = 'mockThunk',
): MockedThunk {
  const thunk = mockFn as MockedThunk;
  thunk.mockImplementation((arg: any) => ({ type: `${typePrefix}/test`, arg }));
  thunk.typePrefix = typePrefix;

  (['fulfilled', 'pending', 'rejected'] as const).forEach((action) => {
    const type = `${typePrefix}/${action}`;

    (thunk as any)[action] = jest.fn().mockReturnValue({ type });
    thunk[action].match = jest.fn().mockReturnValue(false);
    thunk[action].type = type;
  });

  return thunk;
}

export function mockThunks<
  T extends Record<string, unknown>,
  M extends jest.FunctionPropertyNames<Required<T>>,
>(object: T, methods: M[]) {
  return methods.map((method) => mockThunk(jest.spyOn(object, method), String(method)));
}

export type MockedDispatch = jest.Mock & { unwrap: jest.Mock };

export function mockDispatch(unwrapMock?: jest.Mock): MockedDispatch {
  const unwrap = unwrapMock || jest.fn().mockResolvedValue({});
  const mock = jest.fn().mockImplementation(() => {
    const promise = Promise.resolve({});
    (promise as any).unwrap = unwrap;
    return promise;
  });

  (mock as MockedDispatch).unwrap = unwrap;

  return mock as MockedDispatch;
}
