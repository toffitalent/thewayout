import { Context, guard, Joi, Middleware, Next, Router, validator } from '@disruptive-labs/server';
import { cloneDeep } from 'lodash';
import * as Mail from '@two/mail';
import { MediaType, UpdateUserRequest, UserType } from '@two/shared';
import { ForeignKeyViolationError, NotFoundError, UniqueViolationError, User } from '@app/models';

const router = new Router();

interface UserRequestParams {
  userId?: string;
}

type UserRequestContext<
  Body = unknown,
  Params extends UserRequestParams = UserRequestParams,
> = Context<Body, Params, Record<string, never>, { user: User }>;

// Load user to ctx.state.user
router.use(
  '/',
  validator({ params: Joi.object().keys({ userId: Joi.string().uuid() }) }),
  async (ctx: UserRequestContext, next: Next) => {
    try {
      ctx.state.user = await User.query()
        .findById(ctx.param('userId') || ctx.auth.userId!)
        .throwIfNotFound()
        .withGraphFetched('[client, employer]');
    } catch (err) {
      if (err instanceof NotFoundError) {
        throw ctx.resourceNotFound(`User ${ctx.param('userId') || ctx.auth.userId} not found`);
      }

      /* istanbul ignore next: rethrow unknown error */
      throw err;
    }

    await next();
  },
);

/**
 * GET /users/:userId
 * Get a user
 */
router.get('/', guard(['user']), async (ctx: UserRequestContext) => {
  ctx.send(ctx.state.user.serialize({ ctx }));
});

/**
 * PATCH /users/:userId
 * Update a user
 */
router.patch(
  '/',
  guard(['user'], (ctx: UserRequestContext) => ctx.auth.is(ctx.state.user.id)),
  validator({
    body: Joi.object()
      .keys({
        firstName: Joi.string().max(50).trim(),
        lastName: Joi.string().max(50).trim(),
        email: Joi.string().email().lowercase().trim(),
        password: Joi.string(),
        newPassword: Joi.string().min(8),
        roles: Joi.array().items(Joi.string().valid('admin')).admin(),
        phone: Joi.string().regex(/^\d{10}$/),
        avatar: Joi.string()
          .uri({ relativeOnly: true })
          .regex(new RegExp(`^${MediaType.Avatar}\\/[-\\w]+\\.\\w+$`))
          .trim(),
      })
      .min(1)
      .with('password', 'newPassword'),
  }),
  async (ctx: UserRequestContext<UpdateUserRequest>) => {
    try {
      const { password, newPassword, ...rest } = ctx.request.body;
      const patch: Partial<User> = rest;

      // Verify password if changing
      if (newPassword) {
        if (!(await ctx.state.user.verifyPassword(password!))) {
          throw ctx.invalidRequest('Password does not match', { key: 'password' });
        }

        // Add new password to patch if changed
        if (!(await ctx.state.user.verifyPassword(newPassword))) {
          patch.password = newPassword;
        }
      }

      const user = await User.transaction(async (trx) => {
        const user = await User.query(trx)
          .patch(patch)
          .where('id', ctx.state.user.id)
          .returning('*')
          .first()
          .throwIfNotFound();

        const { firstName, lastName } = patch;
        if (
          ctx.state.user.roles.includes(UserType.Client) &&
          ctx.state.user.client &&
          (firstName || lastName)
        ) {
          await user.$relatedQuery('client', trx).patch({
            ...(firstName && { firstName }),
            ...(lastName && { lastName }),
          });
        }

        return user;
      });

      // Send security email(s)
      if (user.email !== ctx.state.user.email) {
        await Mail.send(
          {
            to: { address: user.email, name: user.name },
            cc: { address: ctx.state.user.email, name: ctx.state.user.name },
          },
          'SecurityEmail',
          { user },
        );
      }

      if (patch.password) {
        await Mail.send(user, 'SecurityPassword', { user });
      }

      ctx.send(user.serialize({ ctx }));
    } catch (err) {
      if (err instanceof UniqueViolationError) {
        throw ctx.resourceConflict(`Email ${ctx.request.body.email} already in use`);
      }

      /* istanbul ignore next: rethrow unknown error */
      throw err;
    }
  },
);

/**
 * DELETE /users/:userId
 * Delete a user
 */
router.delete('/', guard(['admin']), async (ctx: UserRequestContext) => {
  try {
    await ctx.state.user.$query().delete();

    ctx.ok();
  } catch (err) {
    if (err instanceof ForeignKeyViolationError) {
      throw ctx.resourceConflict(`User ${ctx.state.user.id} owns existing resources`);
    }

    /* istanbul ignore next: rethrow unknown error */
    throw err;
  }
});

export const routes = (): Middleware => cloneDeep(router.routes());
