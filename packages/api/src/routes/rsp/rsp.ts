import { Context, guard, Joi, Next, paginate, Router, validator } from '@disruptive-labs/server';
import { Knex } from 'knex';
import * as Mail from '@two/mail';
import {
  JusticeStatus,
  MediaType,
  OffenseCategory,
  RspPosition,
  RspRole,
  State,
  Support,
  VeteranOrJustice,
} from '@two/shared';
import { knex } from '@app/db';
import {
  NotFoundError,
  Rsp,
  RspAccount,
  RspInvitation,
  UniqueViolationError,
  User,
} from '@app/models';
import { RspClient } from '@app/models/RspClient';
import { RspAccountListItemSerializer } from '@app/models/serializers/RspAccountListItem';

const router = new Router();

const rspAccountListItemSerializer = new RspAccountListItemSerializer();

router.use('/', async (ctx, next: Next) => {
  const userId = ctx.auth.userId as string;

  const owner = await RspAccount.query()
    .where({ userId })
    .where({ role: RspRole.owner })
    .where({ rspId: ctx.param('id') })
    .first();

  if (!owner) {
    throw ctx.invalidRequest('Allowed only to owners', { key: 'owner' });
  }

  await next();
});

/**
 * PATCH /rsp/:id
 * Update rsp
 *
 * Updates rsp organization
 */
router.patch(
  '/',
  guard(['rsp']),
  validator({
    body: Joi.object().keys({
      name: Joi.string(),
      description: Joi.string().max(1000),
      address: Joi.string(),
      city: Joi.string(),
      state: Joi.string().valid(...Object.values(State)),
      postalCode: Joi.string(),
      phone: Joi.string().regex(/^\d{10}$/),
      email: Joi.string(),
      avatar: Joi.string()
        .uri({ relativeOnly: true })
        .regex(new RegExp(`^${MediaType.Avatar}\\/[-\\w]+\\.\\w+$`))
        .trim(),
      servicesArea: Joi.array().items(Joi.string()),
      support: Joi.array().items(Joi.string().valid(...Object.values(Support))),
      justiceStatus: Joi.array().items(Joi.string().valid(...Object.values(JusticeStatus))),
      offenses: Joi.array().items(Joi.string().valid(...Object.values(OffenseCategory))),
      veteranOrJustice: Joi.array().items(Joi.string().valid(...Object.values(VeteranOrJustice))),
    }),
  }),
  async (ctx: Context) => {
    try {
      const rsp = await Rsp.query()
        .findById(ctx.param('id'))
        .patch(ctx.request.body)
        .returning('*')
        .first()
        .throwIfNotFound();

      ctx.send(Rsp.serialize(rsp, { ctx }));
    } catch (err) {
      if (err instanceof UniqueViolationError) {
        throw ctx.resourceConflict('Rsp name already exist');
      }

      /* istanbul ignore next: rethrow unknown error */
      throw err;
    }
  },
);

/**
 * GET /rsp/:id/case-managers
 * Get rsp case managers
 *
 */

router.get(
  '/case-managers',
  guard(['rsp']),
  paginate({ encode: false, limit: 25, max: 250 }),
  async (ctx: Context) => {
    const { results, ...pagination } = await RspAccount.query()
      .select([
        'rsp_accounts.*',
        'users.email',
        'users.firstName',
        'users.lastName',
        'users.phone',
        'users.avatar',
        RspClient.query()
          .where('caseManagerId', knex.raw('rsp_accounts.id'))
          .count()
          .as('caseLoad'),
      ])
      .leftJoin('users', (join: Knex.JoinClause) => {
        join.on('rsp_accounts.userId', 'users.id');
      })
      .where({ 'rsp_accounts.rspId': ctx.param('id') })
      .where({ position: RspPosition.caseManager })
      .where({ isProfileFilled: true })
      .paginate(ctx.pagination!);

    ctx.send(rspAccountListItemSerializer.serialize(results, { ctx }));
    ctx.pagination!.meta = pagination;
  },
);

/**
 * POST /rsp/:id/accounts/invite
 * Sends invitation
 *
 */

router.post(
  '/accounts/invite',
  guard(['rsp']),
  validator({
    body: Joi.object().keys({
      firstName: Joi.string().trim().strict().min(2).required(),
      lastName: Joi.string().trim().strict().min(2).required(),
      phone: Joi.string()
        .regex(/^\d{10}$/)
        .required(),
      email: Joi.string().required(),
    }),
  }),
  async (ctx: Context) => {
    const { firstName, lastName, email } = ctx.request.body;
    try {
      const user = await User.query().where({ email }).first();
      if (user) {
        throw ctx.resourceConflict(`Account with that email already exist`);
      }

      const invitation = await RspInvitation.query()
        .insert({
          rspId: ctx.param('id'),
          ...ctx.request.body,
        })
        .withGraphFetched('rsp');

      await Mail.send(
        { to: { address: email, name: `${firstName} ${lastName}` } },
        'InviteCaseManager',
        { invitationId: invitation.id, ...ctx.request.body, rspName: invitation.rsp?.name },
      );

      ctx.ok();
    } catch (err) {
      if (err instanceof UniqueViolationError) {
        throw ctx.resourceConflict('Invitation for that email already send');
      }

      /* istanbul ignore next: rethrow unknown error */
      throw err;
    }
  },
);

/**
 * DELETE /rsp/:id/invitations/:invitationId
 * Removes rsp invitation
 *
 */

router.delete('/invitations/:invitationId', guard(['rsp']), async (ctx: Context) => {
  await RspInvitation.query()
    .findById(ctx.param('invitationId'))
    .where({ rspId: ctx.param('id') })
    .delete();

  ctx.ok();
});

/**
 * GET /rsp/:id/invitations
 * Get rsp invitations
 *
 */

router.get(
  '/invitations',
  guard(['rsp']),
  paginate({ encode: false, limit: 25, max: 250 }),
  async (ctx: Context) => {
    const query = RspInvitation.query()
      .where({
        'rsp_invitations.rspId': ctx.param('id'),
      })
      .select(
        'rsp_invitations.*',
        'users.id as userId',
        'rsp_accounts.isProfileFilled as isProfileFilled',
      )
      .leftJoin('users', (join: Knex.JoinClause) => {
        join.on('rsp_invitations.email', 'users.email');
      })
      .leftJoin('rsp_accounts', (join: Knex.JoinClause) => {
        join.andOn('rsp_accounts.userId', '=', knex.raw('users.id'));
      })
      .where((builder) => {
        builder.where('isProfileFilled', false).orWhereNull('isProfileFilled');
      });

    ctx.pagination!.meta.total = await query.resultSize();
    const results = await query
      .where((builder) => {
        if (ctx.query.before) {
          builder.where('id', '<', ctx.query.before);
        }
      })
      .limit(ctx.pagination!.limit);

    ctx.send(RspInvitation.serialize(results, { ctx }));
  },
);

/**
 * GET /rsp/:id/accounts/:userId
 * Get rsp account
 *
 */

router.get('/accounts/:userId', guard(['rsp']), async (ctx: Context) => {
  try {
    const account = await RspAccount.query()
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
      .where({ 'rsp_accounts.userId': ctx.param('userId') })
      .where({ rspId: ctx.param('id') })
      .first()
      .throwIfNotFound();

    ctx.send(RspAccount.serialize(account, { ctx }));
  } catch (err) {
    if (err instanceof NotFoundError) {
      throw ctx.resourceConflict(`Account not found`);
    }

    /* istanbul ignore next: rethrow unknown error */
    throw err;
  }
});

/**
 * PATCH /rsp/:id/accounts/:userId
 * Updates rsp account by owner
 *
 */
router.patch(
  '/accounts/:userId',
  guard(['rsp']),
  validator({
    body: Joi.object().keys({
      firstName: Joi.string(),
      lastName: Joi.string(),
      phone: Joi.string().regex(/^\d{10}$/),
      email: Joi.string(),
    }),
  }),
  async (ctx: Context) => {
    try {
      await User.query()
        .findById(ctx.param('userId'))
        .patch(ctx.request.body)
        .returning('*')
        .first()
        .throwIfNotFound();

      const updatedRspAccount = await RspAccount.query()
        .where({ rspId: ctx.param('id') })
        .where({ userId: ctx.param('userId') })
        .where({ role: RspRole.member })
        .returning('*')
        .first()
        .throwIfNotFound()
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
        });

      ctx.send(RspAccount.serialize(updatedRspAccount, { ctx }));
    } catch (err) {
      if (err instanceof NotFoundError) {
        throw ctx.resourceConflict(`Account not found`);
      }

      /* istanbul ignore next: rethrow unknown error */
      throw err;
    }
  },
);

/**
 * DELETE /rsp/:id/accounts/:userId
 * Removes rsp account
 *
 */

router.delete('/accounts/:userId', guard(['rsp']), async (ctx: Context) => {
  try {
    const account = await RspAccount.query()
      .where({ 'rsp_accounts.userId': ctx.param('userId') })
      .where({ rspId: ctx.param('id') })
      .throwIfNotFound()
      .first()
      .returning('*');

    await User.query().findById(account.userId).delete();

    ctx.ok();
  } catch (err) {
    if (err instanceof NotFoundError) {
      throw ctx.resourceConflict(`Account not found`);
    }

    /* istanbul ignore next: rethrow unknown error */
    throw err;
  }
});

export { router };
