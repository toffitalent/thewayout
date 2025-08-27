import axios from 'axios';
import { MediaType } from '@two/shared';
import { client } from '../client';
import { uploads } from '../uploads';

jest.mock('../client');

describe('API > Uploads', () => {
  const data = {
    fields: { acl: 'private', key: 'avatars/test.jpg' },
    key: 'avatars/test.jpg',
    url: 'https://nuooly-dev.s3.amazonaws.com',
  };

  const file = new File(['hello'], 'hello.jpg', { type: 'image/jpeg' });

  test('executes file upload create request', async () => {
    const spy = jest.spyOn(axios, 'post').mockImplementation(() => Promise.resolve());
    (client.post as jest.Mock).mockImplementationOnce(() => Promise.resolve({ data }));
    const res = await uploads.create(MediaType.Avatar, file);
    expect(spy).toBeCalledWith(data.url, expect.any(FormData), {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    expect(res).toEqual({ key: data.key });
  });
});
