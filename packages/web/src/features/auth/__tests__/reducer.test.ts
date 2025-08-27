import { RspRole } from '@two/shared';
import { createMember, createRsp } from '@app/features/rsp/actions';
import { createState, fixtures, makeGetState } from '@test';
import { fetchUser, logout, updateUser } from '../actions';
import { reducer, selectAuthUser, selectAuthUserId } from '../reducer';

const getState = makeGetState('auth');
const { user, rsp, rspAccountMember } = fixtures;

describe('Auth > Reducer', () => {
  test('returns empty initial state', () => {
    expect(reducer(undefined, { type: '' })).toMatchSnapshot();
  });

  test('handles fetchUser fulfilled actions', () => {
    expect(
      reducer(getState({ user: null }), fetchUser.fulfilled(user, '', undefined)),
    ).toMatchSnapshot();
  });

  test('handles updateUser fulfilled actions', () => {
    expect(
      reducer(getState(), updateUser.fulfilled({ ...user, firstName: 'Updated' }, '', {})),
    ).toMatchSnapshot();
  });

  test('handles logout fulfilled actions', () => {
    expect(reducer(getState(), logout.fulfilled(undefined, '', undefined))).toMatchSnapshot();
  });

  test('handles create rsp fulfilled actions', () => {
    expect(
      reducer(
        getState({ user: {} }),
        createRsp.fulfilled(
          { rsp, owner: { ...rspAccountMember, role: RspRole.owner } },
          '',
          {} as any,
        ),
      ),
    ).toMatchSnapshot();
  });

  test('handles create member fulfilled actions', () => {
    expect(
      reducer(getState({ user: {} }), createMember.fulfilled(rspAccountMember, '', {} as any)),
    ).toMatchSnapshot();
  });
});

describe('Auth > Selectors', () => {
  test('selectAuthUser returns authenticated user', () => {
    expect(selectAuthUser(createState())).toBe(user);
    expect(selectAuthUser(createState({ 'auth.user': null }))).toBe(null);
  });

  test('selectAuthUserId returns authenticated user ID', () => {
    expect(selectAuthUserId(createState())).toBe(user.id);
    expect(selectAuthUserId(createState({ 'auth.user': null }))).toBe(null);
  });
});
