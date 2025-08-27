import { DeleteObjectCommand, HeadObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { createPresignedPost } from '@aws-sdk/s3-presigned-post';
import { Context, guard, Joi, Router, throttle, validator } from '@disruptive-labs/server';
import mime from 'mime';
import { v4 as uuidV4 } from 'uuid';
import config from '@two/config';
import { MediaContentType, MediaType, UploadMediaRequest } from '@two/shared';

const client = new S3Client({});

const router = new Router();

/**
 * POST /uploads/:type
 * Create upload URL
 */
router.post(
  '/:type',
  guard(),
  throttle({ duration: 900, max: 30 }),
  validator({
    body: Joi.object().keys({
      contentType: Joi.string()
        .valid(...Object.values(MediaContentType))
        .required(),
    }),
    params: Joi.object().keys({
      type: Joi.string()
        .valid(...Object.values(MediaType))
        .required(),
    }),
  }),
  async (ctx: Context<UploadMediaRequest, { type?: MediaType }>) => {
    const { contentType } = ctx.request.body;

    const key = `${ctx.param('type')}/${uuidV4()}-${Date.now()}.${mime
      .getExtension(contentType)
      ?.replace(/jpeg$/, 'jpg')}`;

    const { fields } = await createPresignedPost(client, {
      Bucket: config.get('uploads.default.bucket', ''),
      Key: key,
      Expires: 300,
      Conditions: [['content-length-range', 1, 10485760]],
      Fields: {
        acl: 'private',
        'Cache-Control': 'public, max-age=31536000, s-maxage=604800',
        'Content-Type': contentType,
        'x-amz-meta-user-id': `${ctx.auth.userId}`,
      },
    });

    ctx.send({
      fields,
      key,
      url: `https://${config.get('uploads.default.bucket')}.s3.amazonaws.com`,
    });
  },
);

/**
 * DELETE /uploads/:type/:filename
 * Delete previously uploaded file
 */
router.delete(
  '/:type/:filename',
  guard(),
  throttle({ duration: 300, max: 150 }),
  validator({
    params: Joi.object().keys({
      type: Joi.string()
        .valid(...Object.values(MediaType))
        .required(),
      filename: Joi.string()
        .regex(/^[-\w]+\.\w+$/)
        .required(),
    }),
  }),
  async (ctx: Context<unknown, { type?: MediaType; filename?: string }>) => {
    const key = `${ctx.param('type')}/${ctx.param('filename')}`;

    try {
      // Retrieve object metadata from S3
      const object = await client.send(
        new HeadObjectCommand({
          Bucket: config.get('uploads.default.bucket', ''),
          Key: key,
        }),
      );

      // Check auth user "owns" object and is only deleting recent upload
      if (
        object.Metadata?.['user-id'] !== ctx.auth.userId ||
        (object.LastModified?.getTime() ?? 0) < Date.now() - 3600 * 1000
      ) {
        throw ctx.badRequest(`Cannot delete upload ${key}`);
      }

      await client.send(
        new DeleteObjectCommand({ Bucket: config.get('uploads.default.bucket', ''), Key: key }),
      );

      ctx.ok();
    } catch (err: any) {
      if (err.code === 'NotFound') {
        throw ctx.resourceNotFound(`Upload ${key} not found`);
      }

      /* istanbul ignore next */
      throw err;
    }
  },
);

export { router };
