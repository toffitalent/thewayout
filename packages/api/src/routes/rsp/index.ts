import { Context, guard, Joi, Next, Router, validator } from '@disruptive-labs/server';
import { Knex } from 'knex';
import {
  CreateRspRequest,
  JusticeStatus,
  MediaType,
  OffenseCategory,
  RspPosition,
  RspRole,
  State,
  Support,
  VeteranOrJustice,
} from '@two/shared';
import { NotFoundError, Rsp, RspAccount, UniqueViolationError, User } from '@app/models';
import { router as accounts } from './accounts';
import { router as clients } from './clients';
import { router as rsp } from './rsp';

const router = new Router();

router.use('/:id', async (ctx, next: Next) => {
  const rsp = await Rsp.query().findById(ctx.param('id')).throwIfNotFound();
  if (!rsp) {
    throw ctx.resourceNotFound('Rsp not found');
  }

  await next();
});

/**
 * POST /rsp
 * Creates rsp organization
 *
 * Adds a new rsp organization and updates owner account
 */

router.post(
  '/',
  guard(['rsp']),
  validator({
    body: Joi.object().keys({
      name: Joi.string().required(),
      avatar: Joi.string()
        .uri({ relativeOnly: true })
        .regex(new RegExp(`^${MediaType.Avatar}\\/[-\\w]+\\.\\w+$`))
        .trim(),
      description: Joi.string().required().max(1000),
      address: Joi.string().required(),
      city: Joi.string().required(),
      state: Joi.string()
        .valid(...Object.values(State))
        .required(),
      postalCode: Joi.string().required(),
      phone: Joi.string().regex(/^\d{10}$/),
      email: Joi.string(),
      servicesArea: Joi.array().items(Joi.string()).required(),
      support: Joi.array()
        .items(Joi.string().valid(...Object.values(Support)))
        .min(1)
        .required(),
      veteranOrJustice: Joi.array()
        .items(Joi.string().valid(...Object.values(VeteranOrJustice)))
        .min(1)
        .required(),
      justiceStatus: Joi.when('veteranOrJustice', {
        is: Joi.array().items(
          Joi.string().valid(VeteranOrJustice.justiceImpacted).required(),
          Joi.string(),
        ),
        then: Joi.array()
          .items(Joi.string().valid(...Object.values(JusticeStatus)))
          .min(1)
          .required(),
      }),
      offenses: Joi.when('veteranOrJustice', {
        is: Joi.array().items(
          Joi.string().valid(VeteranOrJustice.justiceImpacted).required(),
          Joi.string(),
        ),
        then: Joi.array()
          .items(Joi.string().valid(...Object.values(OffenseCategory)))
          .min(1)
          .required(),
      }),
      owner: Joi.object().keys({
        phone: Joi.string().regex(/^\d{10}$/),
        position: Joi.string()
          .valid(...Object.values(RspPosition))
          .required(),
        avatar: Joi.string()
          .uri({ relativeOnly: true })
          .regex(new RegExp(`^${MediaType.Avatar}\\/[-\\w]+\\.\\w+$`))
          .trim(),
      }),
    }),
  }),
  async (ctx: Context<CreateRspRequest>) => {
    try {
      const userId = ctx.auth.userId as string;
      const { owner, ...rspBody } = ctx.request.body;

      const existingRspAccount = await RspAccount.query()
        .where({ userId })
        .where({ role: RspRole.owner })
        .first()
        .throwIfNotFound();

      if (!existingRspAccount) {
        throw ctx.badRequest('Rsp owner not found');
      }

      const trx = await Rsp.transaction(async (trx) => {
        const rsp = await Rsp.query(trx)
          .insert({ ...rspBody })
          .returning('*');

        const { phone, position, avatar } = owner;

        const rspAccountPatch = await RspAccount.query(trx)
          .where({ userId })
          .patch({ position, isProfileFilled: true, rspId: rsp.id })
          .returning('*')
          .first()
          .throwIfNotFound();

        await User.query(trx).findById(userId).patch({ phone, avatar });

        const rspAccount = await rspAccountPatch
          .$query(trx)
          .select(['rsp_accounts.*', 'users.phone', 'users.avatar'])
          .leftJoin('users', (join: Knex.JoinClause) => {
            join.on('rsp_accounts.userId', 'users.id');
          });

        return { rsp, rspAccount };
      });

      ctx.send({
        rsp: await Rsp.serialize(trx.rsp, { ctx }),
        owner: await RspAccount.serialize(trx.rspAccount, { ctx }),
      });
    } catch (err) {
      if (err instanceof NotFoundError) {
        throw ctx.resourceNotFound('Rsp user not found');
      }
      if (err instanceof UniqueViolationError) {
        throw ctx.resourceConflict('Rsp name already exist');
      }

      /* istanbul ignore next: rethrow unknown error */
      throw err;
    }
  },
);

router.mount('/:id/accounts', accounts);
router.mount('/:id/clients', clients);
router.mount('/:id', rsp);

export { router };
