import { Context, guard, Joi, Router, throttle, validator } from '@disruptive-labs/server';
import { CreateUserRequest, RspPosition, RspRole, UserType } from '@two/shared';
import { RspAccount, RspInvitation, UniqueViolationError, User } from '@app/models';
import { router as password } from './password';
import { routes as userRoutes } from './user';

const router = new Router();

/**
 * GET /users
 * List all users
 */
router.get('/', guard(['admin']), async (ctx: Context<unknown>) => {
  const users = await User.query().orderBy('id', 'DESC');
  ctx.send(User.serialize(users, { ctx }));
});

/**
 * POST /users
 * Create a user
 */
router.post(
  '/',
  throttle({ max: 25 }),
  validator({
    body: Joi.object().keys({
      firstName: Joi.string().required().max(50).trim(),
      lastName: Joi.string().max(50).trim(),
      email: Joi.string().email().required().lowercase().trim(),
      password: Joi.string().required().min(8),
      type: Joi.string()
        .valid(...Object.values(UserType))
        .default(UserType.Client),
      invitationId: Joi.string().uuid(),
      phone: Joi.string().regex(/^\d{10}$/),
    }),
  }),
  async (ctx: Context<CreateUserRequest>) => {
    try {
      const { type, invitationId, ...body } = ctx.request.body;

      let rspInvitation: RspInvitation | undefined;
      if (type === UserType.Rsp && invitationId) {
        rspInvitation = await RspInvitation.query()
          .where({ id: invitationId })
          .where({ email: ctx.request.body.email })
          .first();
        if (!rspInvitation) {
          throw ctx.resourceNotFound('Invitation not found');
        }
      }

      const user = await User.transaction(async (trx) => {
        const newUser = await User.query(trx)
          .insert({
            ...body,
            roles: [type],
          })
          .returning('*');

        if (type === UserType.Rsp) {
          const rspId = rspInvitation?.rspId;
          await RspAccount.query(trx).insert({
            userId: newUser.id,
            role: rspId ? RspRole.member : RspRole.owner,
            ...(rspId && { position: RspPosition.caseManager }),
            ...(rspId && { rspId }),
          });
        }

        return newUser;
      });

      // TODO: Enable this once copy supplied
      // await Mail.send(user, 'Welcome', { user });

      ctx.created(user.serialize({ ctx }));
      ctx.set('Location', `/users/${user.id}`);
    } catch (err) {
      if (err instanceof UniqueViolationError) {
        throw ctx.resourceConflict(`Email ${ctx.request.body.email} already in use`);
      }

      /* istanbul ignore next: rethrow unknown error */
      throw err;
    }
  },
);

// Add sub-routers
router.mount('/password', password);
router.use('/:userId', userRoutes());

export { router };
