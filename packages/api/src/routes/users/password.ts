import { Context, Joi, Next, Router, throttle, validator } from '@disruptive-labs/server';
import crypto from 'crypto';
import { promisify } from 'util';
import * as Mail from '@two/mail';
import { AuthGrantType } from '@two/shared';
import { AppClient, User } from '@app/models';

const randomBytes = promisify(crypto.randomBytes);

const router = new Router();

interface PasswordResetBaseRequestBody {
  clientId: string;
  clientSecret: string;
}

router.use(
  '/',
  throttle({
    duration: 300,
    max: 30,
  }),
  // Validate client
  async (ctx: Context<PasswordResetBaseRequestBody>, next: Next) => {
    const { clientId, clientSecret } = ctx.request.body;

    const client = await AppClient.query().findById(clientId);

    if (!client || client.secret !== clientSecret || client.grantType !== AuthGrantType.Password) {
      throw ctx.invalidRequest('Client not authorized for password resets', { key: 'clientId' });
    }

    await next();
  },
);

/**
 * POST /users/password/token
 * Create and send a password reset token
 */

interface CreatePasswordTokenRequestBody extends PasswordResetBaseRequestBody {
  username: string;
}

router.post(
  '/token',
  validator({
    body: Joi.object().keys({
      username: Joi.string().email().lowercase().required().trim(),
    }),
  }),
  async (ctx: Context<CreatePasswordTokenRequestBody>) => {
    const user = await User.query().findOne('username', ctx.request.body.username);

    // If user found, create reset token and send email.
    // NOTE: By not awaiting promise, response will be sent and remaining processing will happen
    // out-of-band. We want to avoid leaking info on user existence due to differing response
    // times between requests with valid usernames and those without.
    if (user) {
      randomBytes(32)
        .then(async (buffer) => {
          const token = buffer.toString('hex');

          // Add token to Redis - expires in 1 hour
          await ctx.store().set(`password-reset:${token}`, user.id, 'EX', 3600);

          await Mail.send(user, 'PasswordReset', { token, user });
        })
        .catch((err) => ctx.emit('error', err, ctx));
    }

    ctx.ok();
  },
);

/**
 * POST /users/password
 * Reset user password using sent token
 */

interface ResetPasswordRequestBody extends PasswordResetBaseRequestBody {
  password: string;
  token: string;
}

router.post(
  '/',
  validator({
    body: Joi.object().keys({
      password: Joi.string().required().min(8),
      token: Joi.string().required(),
    }),
  }),
  async (ctx: Context<ResetPasswordRequestBody>) => {
    const { password, token } = ctx.request.body;

    // Retrieve userId from Redis using token
    const userId = await ctx.store().get(`password-reset:${token}`);

    // Reject request if token not found
    if (!userId) throw ctx.invalidRequest('Invalid password reset token', { key: 'token' });

    // Update user
    const user = await User.query()
      .patch({
        password,
      })
      .where('id', userId)
      .returning('*')
      .first()
      .throwIfNotFound();

    await Mail.send(user, 'SecurityPassword', { user });

    ctx.ok();

    // Delete token to prevent replay
    await ctx.store().del(`password-reset:${token}`);
  },
);

export { router };
