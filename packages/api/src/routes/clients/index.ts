import { Context, guard, Joi, Router, validator } from '@disruptive-labs/server';
import { Knex } from 'knex';
import {
  Age,
  CreateClientProfileRequest,
  Ethnicity,
  ExperienceSkills,
  Gender,
  JusticeStatus,
  Language,
  LanguageLevel,
  MaritalStatus,
  OffenseCategory,
  Orientation,
  PersonalStrengths,
  ReferredBy,
  ReleasedAt,
  Religion,
  RspClientStatus,
  State,
  StateFederal,
  Support,
  TimeServed,
  UserType,
  VeteranBranchOfService,
  VeteranCampaign,
  VeteranOrJustice,
  VeteranRank,
  VeteranStatus,
  VeteranTypeDischarge,
} from '@two/shared';
import { Client, NotFoundError, Rsp, RspAccount, User } from '@app/models';
import { RspClient } from '@app/models/RspClient';
import { ClientCaseManagerSerializer } from '@app/models/serializers/ClientCaseManager';
import * as Slack from '@app/services/Slack';
import { routes as clientRoutes } from './client';
import { router as jobs } from './jobs';
import { router as rsp } from './rsp';

const router = new Router();
const caseManagerSerializer = new ClientCaseManagerSerializer();

/**
 * GET /clients
 * List all clients
 */
router.get('/', guard(['admin']), async (ctx: Context<unknown>) => {
  const users = await User.query()
    .orderBy('id', 'DESC')
    .where('roles', '@>', [UserType.Client])
    .withGraphFetched('[client, rspClient.[rsp]]');

  ctx.send(User.serialize(users, { ctx }));
});

/**
 * POST /clients
 * Create client
 *
 * Adds a new client profile
 */

router.post(
  '/',
  guard(['client']),
  validator({
    body: Joi.object().keys({
      veteranOrJustice: Joi.array()
        .items(Joi.string().valid(...Object.values(VeteranOrJustice)))
        .required(),
      phone: Joi.string().regex(/^\d{10}$/),
      address: Joi.string().required(),
      city: Joi.string().required(),
      state: Joi.string()
        .valid(...Object.values(State))
        .required(),
      postalCode: Joi.string().required(),
      support: Joi.array().items(Joi.string().valid(...Object.values(Support))),
      gender: Joi.valid(...Object.values(Gender)),
      orientation: Joi.valid(...Object.values(Orientation)),
      religion: Joi.valid(...Object.values(Religion)),
      maritalStatus: Joi.valid(...Object.values(MaritalStatus)),
      age: Joi.valid(...Object.values(Age)),
      disability: Joi.boolean(),
      ethnicity: Joi.valid(...Object.values(Ethnicity)),
      veteranStatus: Joi.valid(...Object.values(VeteranStatus)),
      referredBy: Joi.string()
        .valid(...Object.values(ReferredBy))
        .required(),
      personalStrengths: Joi.array().items(Joi.string().valid(...Object.values(PersonalStrengths))),
      experience: Joi.array().items(Joi.string().valid(...Object.values(ExperienceSkills))),
      languages: Joi.array().items(
        Joi.object().keys({
          language: Joi.string()
            .valid(...Object.values(Language))
            .required(),
          level: Joi.string()
            .valid(...Object.values(LanguageLevel))
            .required(),
        }),
      ),
      relativeExperience: Joi.array().items(
        Joi.object().keys({
          title: Joi.string().required(),
          company: Joi.string().required(),
          startAtMonth: Joi.string()
            .regex(/^(1[0-2]|[1-9])$/)
            .required(),
          startAtYear: Joi.string()
            .regex(/^\d{4}$/)
            .required(),
          endAtMonth: Joi.string().regex(/^(1[0-2]|[1-9])$/),
          endAtYear: Joi.string().regex(/^\d{4}$/),
          location: Joi.string().required(),
          description: Joi.string().max(500).required(),
        }),
      ),
      personalSummary: Joi.string().max(1000),
      education: Joi.array().items(
        Joi.object().keys({
          schoolIssuer: Joi.string().required(),
          degree: Joi.string().required(),
          areaOfStudy: Joi.string().required(),
          startYear: Joi.string()
            .regex(/^\d{4}$/)
            .required(),
          yearEarned: Joi.string().regex(/^\d{4}$/),
          description: Joi.string().max(500).required(),
        }),
      ),
      license: Joi.array().items(
        Joi.object().keys({
          licenseName: Joi.string().required(),
          issuingOrganization: Joi.string().required(),
          issueAtMonth: Joi.string()
            .regex(/^(1[0-2]|[1-9])$/)
            .required(),
          issueAtYear: Joi.string()
            .regex(/^\d{4}$/)
            .required(),
          expirationAtMonth: Joi.string().regex(/^(1[0-2]|[1-9])$/),
          expirationAtYear: Joi.string().regex(/^\d{4}$/),
        }),
      ),
      rspId: Joi.string().uuid(),
      isNewRspMember: Joi.boolean(),

      // VeteranOrJustice justiceImpacted
      offense: Joi.when('veteranOrJustice', {
        is: Joi.array().items(
          Joi.string().valid(VeteranOrJustice.justiceImpacted).required(),
          Joi.string(),
        ),
        then: Joi.array().items(Joi.string().valid(...Object.values(OffenseCategory))),
      }),
      justiceStatus: Joi.when('veteranOrJustice', {
        is: Joi.array().items(
          Joi.string().valid(VeteranOrJustice.justiceImpacted).required(),
          Joi.string(),
        ),
        then: Joi.string()
          .valid(...Object.values(JusticeStatus))
          .required(),
      }),
      facility: Joi.string(),
      expectedReleasedAt: Joi.string().regex(/^\d{4}-(0?[1-9]|1[012])-(0?[1-9]|[12][0-9]|3[01])$/),
      releasedCounty: Joi.string(),
      sexualOffenderRegistry: Joi.boolean(),
      sbn: Joi.boolean(),
      timeServed: Joi.when('veteranOrJustice', {
        is: Joi.array().items(
          Joi.string().valid(VeteranOrJustice.justiceImpacted).required(),
          Joi.string(),
        ),
        then: Joi.string().valid(...Object.values(TimeServed)),
      }),
      releasedAt: Joi.when('veteranOrJustice', {
        is: Joi.array().items(
          Joi.string().valid(VeteranOrJustice.justiceImpacted).required(),
          Joi.string(),
        ),
        then: Joi.string().valid(...Object.values(ReleasedAt)),
      }),
      stateOrFederal: Joi.when('veteranOrJustice', {
        is: Joi.array().items(
          Joi.string().valid(VeteranOrJustice.justiceImpacted).required(),
          Joi.string(),
        ),
        then: Joi.string().valid(...Object.values(StateFederal)),
      }),

      // VeteranOrJustice justiceImpacted
      veteranService: Joi.when('veteranOrJustice', {
        is: Joi.array().items(
          Joi.string().valid(VeteranOrJustice.veteran).required(),
          Joi.string(),
        ),
        then: Joi.array()
          .items(Joi.string().valid(...Object.values(VeteranBranchOfService)))
          .min(1),
      }),
      veteranRank: Joi.when('veteranOrJustice', {
        is: Joi.array().items(
          Joi.string().valid(VeteranOrJustice.veteran).required(),
          Joi.string(),
        ),
        then: Joi.string()
          .valid(...Object.values(VeteranRank))
          .required(),
      }),
      veteranStartAt: Joi.when('veteranOrJustice', {
        is: Joi.array().items(
          Joi.string().valid(VeteranOrJustice.veteran).required(),
          Joi.string(),
        ),
        then: Joi.string()
          .regex(/^\d{4}-(0?[1-9]|1[012])-(0?[1-9]|[12][0-9]|3[01])$/)
          .required(),
      }),
      veteranEndAt: Joi.string().regex(/^\d{4}-(0?[1-9]|1[012])-(0?[1-9]|[12][0-9]|3[01])$/),
      veteranReservist: Joi.when('veteranOrJustice', {
        is: Joi.array().items(
          Joi.string().valid(VeteranOrJustice.veteran).required(),
          Joi.string(),
        ),
        then: Joi.boolean().required(),
      }),
      veteranCampaigns: Joi.when('veteranOrJustice', {
        is: Joi.array().items(
          Joi.string().valid(VeteranOrJustice.veteran).required(),
          Joi.string(),
        ),
        then: Joi.array().items(Joi.string().valid(...Object.values(VeteranCampaign))),
      }),
      veteranTypeDischarge: Joi.when('veteranOrJustice', {
        is: Joi.array().items(
          Joi.string().valid(VeteranOrJustice.veteran).required(),
          Joi.string(),
        ),
        then: Joi.string()
          .valid(...Object.values(VeteranTypeDischarge))
          .required(),
      }),
      veteranDd214: Joi.when('veteranOrJustice', {
        is: Joi.array().items(
          Joi.string().valid(VeteranOrJustice.veteran).required(),
          Joi.string(),
        ),
        then: Joi.boolean().required(),
      }),
    }),
  }),
  async (ctx: Context<CreateClientProfileRequest>) => {
    const userId = ctx.auth.userId as string;
    const client = await Client.query().where({ userId }).first();

    if (client) {
      throw ctx.resourceConflict(`Profile already exist`);
    }

    const { rspId, isNewRspMember, ...body } = ctx.request.body;
    const { firstName, lastName } = await User.query().findById(userId).throwIfNotFound();
    const newClient = await Client.query()
      .insert({ ...body, firstName, lastName, userId })
      .returning('*');

    if (rspId) {
      const chosenRsp = await Rsp.query().findById(rspId);

      if (!chosenRsp) {
        throw ctx.resourceNotFound('Rsp not found');
      }

      await RspClient.query().insert({
        userId: newClient.userId,
        rspId: chosenRsp.id,
        status: RspClientStatus.pending,
      });
    }
    if (rspId && isNewRspMember) {
      Slack.alert(
        `User ${ctx.auth.userId} choose Reentry Service Provider: I need a reentry pipeline`,
      );
    }

    ctx.send(Client.serialize(newClient, { ctx }));
  },
);

/**
 * GET /clients/case-manager
 * Get client case manager
 *
 */

router.get('/case-manager', guard(['client']), async (ctx: Context) => {
  const userId = ctx.auth.userId as string;

  try {
    const client = await RspClient.query().where({ userId }).first().throwIfNotFound();

    const caseManager = await RspAccount.query()
      .where({ 'rsp_accounts.id': client.caseManagerId })
      .select([
        'users.firstName',
        'users.lastName',
        'users.avatar',
        'users.email',
        'rsp.name as rspName',
      ])
      .leftJoin('users', (join: Knex.JoinClause) => {
        join.on('rsp_accounts.userId', 'users.id');
      })
      .leftJoin('rsp', (join: Knex.JoinClause) => {
        join.on('rsp_accounts.rspId', 'rsp.id');
      })
      .first()
      .throwIfNotFound();

    ctx.send(caseManagerSerializer.serialize(caseManager, { ctx }));
  } catch (err) {
    if (err instanceof NotFoundError) {
      throw ctx.resourceNotFound('Client case manager not found');
    }

    /* istanbul ignore next: rethrow unknown error */
    throw err;
  }
});

router.use('/:id', clientRoutes());
router.mount('/:id/jobs', jobs);
router.mount('/:id/rsp', rsp);

export { router };
