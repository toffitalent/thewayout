import { Context, guard, Joi, paginate, Router, validator } from '@disruptive-labs/server';
import { Knex } from 'knex';
import * as Mail from '@two/mail';
import {
  Age,
  Ethnicity,
  Gender,
  OffenseCategory,
  RspClientStatus,
  RspRole,
  StatCategory,
  StateFederal,
  statistics,
  Support,
  VeteranOrJustice,
} from '@two/shared';
import { knex } from '@app/db';
import { Client, NotFoundError, Rsp, RspAccount } from '@app/models';
import { RspClient } from '@app/models/RspClient';
import { RspClientListItemSerializer } from '@app/models/serializers/RspClientListItem';

const router = new Router();

const rspClientListItemSerializer = new RspClientListItemSerializer();

/**
 * GET /rsp/:id/clients
 * Get rsp clients
 *
 */

router.get(
  '/',
  guard(['rsp']),
  paginate({ encode: false, limit: 25, max: 250 }),
  validator({
    query: Joi.object({
      support: Joi.string().valid(...Object.values(Support)),
      gender: Joi.valid(...Object.values(Gender)),
      age: Joi.valid(...Object.values(Age)),
      ethnicity: Joi.valid(...Object.values(Ethnicity)),
      veteranOrJustice: Joi.string().valid('yes', 'no'),
      offense: Joi.string().valid(...Object.values(OffenseCategory)),
      stateOrFederal: Joi.string().valid(...Object.values(StateFederal)),
      expectedReleasedAt: Joi.string(),
      postalCode: Joi.string(),
      status: Joi.string().valid(...Object.values(RspClientStatus)),
    }),
  }),
  async (ctx: Context) => {
    const userId = ctx.auth.userId as string;
    const account = await RspAccount.query().where({ userId }).first().throwIfNotFound();
    const {
      support,
      gender,
      age,
      ethnicity,
      veteranOrJustice,
      offense,
      stateOrFederal,
      expectedReleasedAt,
      postalCode,
      status,
    } = ctx.query;

    const { results, ...pagination } = await RspClient.query()
      .where({ 'rsp_clients.rspId': ctx.param('id') })
      .where((builder) => {
        if (account.role !== RspRole.owner) {
          builder.andWhere({ caseManagerId: account.id });
        }
      })
      .withGraphFetched('user')
      .select([
        'rsp_clients.*',
        'rsp_accounts.userId as caseManagerUserId',
        'users.firstName as caseManagerFirstName',
        'users.lastName as caseManagerLastName',
        'clients.support',
        'clients.gender',
        'clients.age',
        'clients.ethnicity',
        'clients.veteranOrJustice',
        'clients.offense',
        'clients.stateOrFederal',
        'clients.expectedReleasedAt',
        'clients.postalCode',
      ])
      .leftJoin('rsp_accounts', (join: Knex.JoinClause) => {
        join.on('rsp_clients.caseManagerId', 'rsp_accounts.id');
      })
      .leftJoin('users', (join: Knex.JoinClause) => {
        join.on('rsp_accounts.userId', 'users.id');
      })
      .leftJoin('clients', (join: Knex.JoinClause) => {
        join.on('rsp_clients.userId', 'clients.userId');
      })
      .where((builder) => {
        if (account.role === RspRole.owner) {
          if (support) {
            builder.andWhere('support', '@>', [support]);
          }
          if (offense) {
            builder.andWhere('offense', '@>', [offense]);
          }
          if (gender) {
            builder.andWhere('gender', '=', gender);
          }
          if (age) {
            builder.where('age', '=', age);
          }
          if (ethnicity) {
            builder.where('ethnicity', '=', ethnicity);
          }
          if (veteranOrJustice === 'yes') {
            builder.where('veteranOrJustice', '&&', [VeteranOrJustice.veteran]);
          }
          if (veteranOrJustice === 'no') {
            builder.whereNot('veteranOrJustice', '&&', [VeteranOrJustice.veteran]);
          }
          if (stateOrFederal) {
            builder.where('stateOrFederal', '=', stateOrFederal);
          }
          if (expectedReleasedAt) {
            builder.where('expectedReleasedAt', 'like', `${expectedReleasedAt}%`);
          }
          if (postalCode) {
            builder.where('postalCode', '=', postalCode);
          }
          if (status) {
            builder.where({ status });
            if (status === RspClientStatus.active) {
              builder.whereNotNull('caseManagerId');
            }
            if (status === RspClientStatus.pending) {
              builder.orWhere({ status: RspClientStatus.active }).whereNull('caseManagerId');
            }
          }
        }
      })
      .paginate(ctx.pagination!);

    ctx.send(rspClientListItemSerializer.serialize(results, { ctx }));
    ctx.pagination!.meta = pagination;
  },
);

/**
 * GET /rsp/:id/clients/statistic/:category
 * Get rsp client statistic for given type
 *
 */

router.get(
  '/statistics/:category',
  guard(['rsp']),
  validator({
    params: Joi.object().keys({
      category: Joi.string().valid(...Object.values(StatCategory)),
    }),
  }),
  async (ctx: Context) => {
    const category = ctx.param('category') as StatCategory;
    const { options, fieldName } = statistics[category];
    let counts;

    const query = Client.query()
      .leftJoin('rsp_clients', (join: Knex.JoinClause) => {
        join
          .on('clients.userId', 'rsp_clients.userId')
          .andOn('rsp_clients.rspId', '=', knex.raw('?', [ctx.param('id')]));
      })
      .where('rsp_clients.rspId', ctx.param('id'));

    switch (category) {
      case StatCategory.offense: {
        const rsp = await Rsp.query()
          .findById(ctx.param('id'))
          .select('offenses')
          .throwIfNotFound();
        counts = (rsp.offenses || []).map((offense) =>
          query.clone().where('offense', '@>', [offense]).count().as(offense),
        );
        break;
      }

      case StatCategory.services: {
        const rsp = await Rsp.query().findById(ctx.param('id')).select('support').throwIfNotFound();
        counts = rsp.support.map((support) =>
          query.clone().where('support', '@>', [support]).count().as(support),
        );

        break;
      }

      case StatCategory.releasedAt: {
        const dates = (
          await query.clone().whereNotNull('expectedReleasedAt').select('expectedReleasedAt')
        ).map((client) => {
          const [year, month] = client.expectedReleasedAt!.split('-');
          return `${year}-${month}`;
        });
        const uniqueDates = [...new Set(dates)].sort();
        counts = uniqueDates.map((date) => {
          const [year, month] = date.split('-');
          return query
            .clone()
            .where('expectedReleasedAt', 'like', `${year}-${month}%`)
            .count()
            .as(`${year}-${month}`);
        });
        break;
      }

      case StatCategory.postalCode: {
        const codes = [
          ...new Set((await query.clone().select('postalCode')).map((client) => client.postalCode)),
        ];
        counts = codes.map((code) => query.clone().where('postalCode', '=', code).count().as(code));
        break;
      }

      case StatCategory.status: {
        counts = (options as RspClientStatus[]).map((status) =>
          query
            .clone()
            .where((builder) => {
              builder.where({ status });
              if (status === RspClientStatus.active) {
                builder.whereNotNull('caseManagerId');
              }
              if (status === RspClientStatus.pending) {
                builder.orWhere({ status: RspClientStatus.active }).whereNull('caseManagerId');
              }
            })
            .count()
            .as(status),
        );
        break;
      }

      case StatCategory.veteran: {
        counts = [
          query
            .clone()
            .where('veteranOrJustice', '&&', [VeteranOrJustice.veteran])
            .count()
            .as('yes'),
          query
            .clone()
            .whereNot('veteranOrJustice', '&&', [VeteranOrJustice.veteran])
            .count()
            .as('no'),
        ];
        break;
      }

      default:
        counts = options!.map((option) =>
          query
            .clone()
            .where({ [fieldName]: option })
            .count()
            .as(option),
        );
    }

    const total = await query.resultSize();
    const result = await Rsp.query()
      .findById(ctx.param('id'))
      .select(counts)
      .throwIfNotFound()
      .returning('*');

    ctx.send({ result: { ...(counts.length ? result : {}) }, total });
  },
);

/**
 * GET /rsp/:id/clients/:clientId
 * Get rsp client information
 *
 */

router.get(
  '/:clientId',
  guard(['rsp']),
  validator({
    params: Joi.object().keys({
      clientId: Joi.string().required(),
    }),
  }),
  async (ctx: Context) => {
    try {
      const userId = ctx.auth.userId as string;
      const account = await RspAccount.query().where({ userId }).first().throwIfNotFound();

      const client = await RspClient.query()
        .findById(ctx.param('clientId'))
        .where({ rspId: ctx.param('id') })
        .where((builder) => {
          if (account.role !== RspRole.owner) {
            builder.andWhere({ caseManagerId: account.id });
          }
        })
        .withGraphFetched('user')
        .throwIfNotFound();

      ctx.send(RspClient.serialize(client, { ctx }));
    } catch (err) {
      if (err instanceof NotFoundError) {
        throw ctx.resourceNotFound(`Client ${ctx.param('clientId')} not found`);
      }

      /* istanbul ignore next: rethrow unknown error */
      throw err;
    }
  },
);

/**
 * PATCH /rsp/:id/clients/:clientId
 * Update rsp client
 *
 */

router.patch(
  '/:clientId',
  guard(['rsp']),
  validator({
    body: Joi.object().keys({
      status: Joi.string().valid(...Object.values(RspClientStatus)),
      notes: Joi.string(),
    }),
  }),
  async (ctx: Context) => {
    try {
      const client = await RspClient.query()
        .findById(ctx.param('clientId'))
        .where({ rspId: ctx.param('id') })
        .patch({
          ...ctx.request.body,
          ...(ctx.request.body.status === RspClientStatus.closed && { closedAt: new Date() }),
        })
        .returning('*')
        .throwIfNotFound();

      ctx.send(RspClient.serialize(client, { ctx }));
    } catch (err) {
      if (err instanceof NotFoundError) {
        throw ctx.resourceConflict(`Client ${ctx.param('clientId')} not found`);
      }

      /* istanbul ignore next: rethrow unknown error */
      throw err;
    }
  },
);

/**
 * PATCH /rsp/:id/clients/:clientId/case-manager
 * Assign client to case manager
 *
 */

router.patch(
  '/:clientId/case-manager',
  guard(['rsp']),
  validator({
    body: Joi.object().keys({
      caseManagerId: Joi.string().required().uuid(),
    }),
  }),
  async (ctx: Context) => {
    try {
      const userId = ctx.auth.userId as string;

      const owner = await RspAccount.query()
        .where({ userId })
        .where({ role: RspRole.owner })
        .where({ rspId: ctx.param('id') })
        .first();

      if (!owner) {
        throw ctx.invalidRequest('Allowed only to owners', { key: 'owner' });
      }

      const client = await RspClient.query()
        .findById(ctx.param('clientId'))
        .where({ rspId: ctx.param('id') })
        .patch({ caseManagerId: ctx.request.body.caseManagerId })
        .withGraphFetched('user')
        .returning('*')
        .first()
        .throwIfNotFound();

      const caseManager = (await RspAccount.query()
        .findById(ctx.request.body.caseManagerId)
        .select(['users.email', 'users.first_name', 'users.last_name'])
        .leftJoin('users', (join: Knex.JoinClause) => {
          join.on('rsp_accounts.userId', 'users.id');
        })
        .withGraphFetched('rsp')
        .throwIfNotFound()) as RspAccount & {
        email: string;
        firstName: string;
        lastName: string;
      };

      Mail.send(
        {
          to: {
            address: caseManager.email,
            name: `${caseManager.firstName} ${caseManager.lastName}`,
          },
        },
        'AssignCaseManager',
        {
          firstName: caseManager.firstName,
          rspName: caseManager.rsp!.name,
          rspClientId: client.id,
          client: {
            firstName: client.user!.firstName,
            lastName: client.user!.lastName,
          },
        },
      );

      ctx.send(RspClient.serialize(client, { ctx }));
    } catch (err) {
      if (err instanceof NotFoundError) {
        throw ctx.resourceConflict(`Client ${ctx.param('clientId')} not found`);
      }

      /* istanbul ignore next: rethrow unknown error */
      throw err;
    }
  },
);

export { router };
