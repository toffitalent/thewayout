import { reducer } from '..';

describe('Reducers', () => {
  test('root reducer combines reducers and returns initial state', () => {
    expect(reducer(undefined, { type: 'test' })).toMatchSnapshot();
  });
});
