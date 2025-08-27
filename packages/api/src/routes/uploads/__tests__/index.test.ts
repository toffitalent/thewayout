import { DeleteObjectCommand, HeadObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { createPresignedPost } from '@aws-sdk/s3-presigned-post';
import config from '@two/config';
import { auth, fixtures, request } from '@test';

jest.mock('@aws-sdk/s3-presigned-post');

describe('Routes > Uploads', () => {
  let send: jest.SpyInstance;

  beforeEach(() => {
    // @ts-ignore
    send = jest.spyOn(S3Client.prototype, 'send').mockResolvedValue({});
  });

  describe('POST /api/v1/uploads/:type', () => {
    test('returns a signed S3 upload URL', async () => {
      (createPresignedPost as jest.Mock).mockImplementationOnce((_, { Fields }) =>
        Promise.resolve({ fields: Fields }),
      );

      const res = await request()
        .post('/api/v1/uploads/image')
        .send({
          contentType: 'image/jpeg',
        })
        .use(auth());

      expect(res.status).toBe(200);
      expect(res.type).toBe('application/json');
      expect(res.body).toMatchSnapshot({
        key: expect.any(String),
      });
      expect(res.body.key?.endsWith('jpg')).toBe(true);
      expect(createPresignedPost).toBeCalledWith(expect.any(Object), {
        Bucket: config.get('uploads.default.bucket'),
        Key: expect.any(String),
        Expires: 300,
        Conditions: [['content-length-range', 1, 10485760]],
        Fields: {
          acl: 'private',
          'Cache-Control': 'public, max-age=31536000, s-maxage=604800',
          'Content-Type': 'image/jpeg',
          'x-amz-meta-user-id': fixtures.user1.id,
        },
      });
    });

    test('does not allow unauthenticated requests', async () => {
      const res = await request().post('/api/v1/uploads/image').send({
        contentType: 'image/jpeg',
      });
      expect(res.status).toBe(401);
      expect(res.type).toBe('application/json');
      expect(res.body).toMatchSnapshot();
    });
  });

  describe('DELETE /api/v1/uploads/:type/:filename', () => {
    test('deletes user-owned previous upload', async () => {
      send.mockResolvedValueOnce({
        Metadata: { 'user-id': fixtures.user1.id },
        LastModified: new Date(),
      });

      const res = await request().delete('/api/v1/uploads/image/test-file.jpg').use(auth());
      expect(res.status).toBe(204);

      expect(HeadObjectCommand).toBeCalledWith({
        Bucket: config.get('uploads.default.bucket'),
        Key: 'image/test-file.jpg',
      });

      expect(DeleteObjectCommand).toBeCalledWith({
        Bucket: config.get('uploads.default.bucket'),
        Key: 'image/test-file.jpg',
      });
    });

    test("does not allow deletion of other user's uploads or old uploads", async () => {
      send
        .mockResolvedValueOnce({
          Metadata: { 'user-id': fixtures.user2.id },
          LastModified: new Date(),
        })
        .mockResolvedValueOnce({
          Metadata: { 'user-id': fixtures.user1.id },
          LastModified: new Date(Date.now() - 7200 * 1000),
        });

      const res = await request().delete('/api/v1/uploads/image/test-file.jpg').use(auth());
      expect(res.status).toBe(400);
      expect(res.type).toBe('application/json');
      expect(res.body).toMatchSnapshot();

      const res2 = await request().delete('/api/v1/uploads/image/test-file.jpg').use(auth());
      expect(res2.status).toBe(400);
      expect(res2.type).toBe('application/json');
      expect(res2.body).toMatchSnapshot();
    });

    test('returns resource not found response if S3 cannot find file', async () => {
      const error: any = new Error();
      error.code = 'NotFound';

      send.mockRejectedValueOnce(error);

      const res = await request().delete('/api/v1/uploads/image/test-file.jpg').use(auth());
      expect(res.status).toBe(404);
      expect(res.type).toBe('application/json');
      expect(res.body).toMatchSnapshot();
    });

    test('does not allow unauthenticated requests', async () => {
      const res = await request().delete('/api/v1/uploads/image/test-file.jpg');
      expect(res.status).toBe(401);
      expect(res.type).toBe('application/json');
      expect(res.body).toMatchSnapshot();
    });
  });
});
