import { CreateUserRequest, UpdateUserRequest, User, UserType } from '@two/shared';
import { client } from './client';

const clientId = process.env.NEXT_PUBLIC_API_CLIENT_ID ?? '';
const clientSecret = process.env.NEXT_PUBLIC_API_CLIENT_SECRET ?? '';

async function create(user: CreateUserRequest) {
  const { data } = await client.post<User>('/v1/users', user);
  return data;
}

async function retrieve() {
  const { data } = await client.get<User>('/v1/user');
  return data;
}

async function update(patch: UpdateUserRequest) {
  const { data } = await client.patch<User>(`/v1/user`, patch);
  return data;
}

async function forgotPassword(username: string) {
  const { data } = await client.post('/v1/users/password/token', {
    clientId,
    clientSecret,
    username,
  });
  return data;
}

async function resetPassword(password: string, token: string) {
  const { data } = await client.post('/v1/users/password', {
    clientId,
    clientSecret,
    password,
    token,
  });
  return data;
}

export const user = {
  create,
  retrieve,
  update,
  forgotPassword,
  resetPassword,
};

export { UserType };
export type { User };
