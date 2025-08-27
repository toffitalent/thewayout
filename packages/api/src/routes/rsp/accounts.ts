import { Context, guard, Joi, Router, validator } from '@disruptive-labs/server';
import { Knex } from 'knex';
import { NotFoundError } from 'objection';
import { CreateMemberRsp, MediaType, RspPosition } from '@two/shared';
import { RspAccount, RspAccountListSerializer, User } from '@app/models';

const router = new Router();

const rspListSerializers = new RspAccountListSerializer();

/**
 * PUT /rsp/:id/accounts/:userId
 * Updates rsp account by self
 *
 */

router.put(
  '/:userId',
  guard(['rsp']),
  validator({
    body: Joi.object().keys({
      phone: Joi.string()
        .regex(/^\d{10}$/)
        .required(),
      avatar: Joi.string()
        .uri({ relativeOnly: true })
        .regex(new RegExp(`^${MediaType.Avatar}\\/[-\\w]+\\.\\w+$`))
        .trim(),
    }),
  }),
  async (ctx: Context<CreateMemberRsp>) => {
    const userId = ctx.auth.userId as string;
    if (userId !== ctx.param('userId')) {
      throw ctx.notAuthorized('You cant update not your account');
    }

    try {
      const member = await RspAccount.transaction(async (trx) => {
        await User.query(trx).findById(userId).patch(ctx.request.body);

        const patch = await RspAccount.query()
          .where({ userId })
          .where({ rspId: ctx.param('id') })
          .patch({ isProfileFilled: true })
          .returning('*')
          .first()
          .throwIfNotFound();

        const updatedMember = await patch
          .$query(trx)
          .select([
            'rsp_accounts.*',
            'users.email',
            'users.firstName',
            'users.lastName',
            'users.phone',
            'users.avatar',
          ])
          .leftJoin('users', (join: Knex.JoinClause) => {
            join.on('rsp_accounts.userId', 'users.id');
          })
          .returning('*');

        return updatedMember;
      });

      ctx.send(RspAccount.serialize(member, { ctx }));
    } catch (err) {
      if (err instanceof NotFoundError) {
        throw ctx.resourceNotFound(`Rsp account not found`);
      }

      /* istanbul ignore next: rethrow unknown error */
      throw err;
    }
  },
);

/**
 * GET /rsp/:id/accounts/case-managers
 * Get rsp case managers names
 *
 */

router.get('/case-managers', guard(['rsp']), async (ctx: Context) => {
  const results = await RspAccount.query()
    .select(['rsp_accounts.id', 'users.firstName', 'users.lastName'])
    .leftJoin('users', (join: Knex.JoinClause) => {
      join.on('rsp_accounts.userId', 'users.id');
    })
    .where({ rspId: ctx.param('id') })
    .where({ position: RspPosition.caseManager })
    .where({ isProfileFilled: true });

  ctx.send(rspListSerializers.serialize(results, { ctx }));
});

export { router };
