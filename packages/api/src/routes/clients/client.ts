import { Context, guard, Joi, Middleware, Router, validator } from '@disruptive-labs/server';
import { Knex } from 'knex';
import { cloneDeep } from 'lodash';
import {
  Age,
  ClientType,
  Ethnicity,
  ExperienceSkills,
  Gender,
  JusticeStatus,
  Language,
  LanguageLevel,
  MaritalStatus,
  MediaType,
  OffenseCategory,
  Orientation,
  PersonalStrengths,
  ReferredBy,
  ReleasedAt,
  Religion,
  State,
  StateFederal,
  Support,
  TimeServed,
  VeteranBranchOfService,
  VeteranCampaign,
  VeteranRank,
  VeteranStatus,
  VeteranTypeDischarge,
} from '@two/shared';
import { Client, User } from '@app/models';
import { RspClient } from '@app/models/RspClient';

const router = new Router();

/**
 * PATCH /clients/:id
 * Update client
 *
 * Updates client profile
 */
router.patch(
  '/',
  guard(['client']),
  validator({
    body: Joi.object().keys({
      firstName: Joi.string(),
      lastName: Joi.string(),
      email: Joi.string().email().lowercase().trim(),
      avatar: Joi.string()
        .uri({ relativeOnly: true })
        .regex(new RegExp(`^${MediaType.Avatar}\\/[-\\w]+\\.\\w+$`))
        .trim(),
      justiceStatus: Joi.valid(...Object.values(JusticeStatus)),
      facility: Joi.alternatives().try(Joi.any().valid(null), Joi.string()),
      expectedReleasedAt: Joi.alternatives().try(
        Joi.any().valid(null),
        Joi.string().regex(/^\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/),
      ),
      releasedCounty: Joi.alternatives().try(Joi.any().valid(null), Joi.string()),
      phone: Joi.alternatives().try(Joi.any().valid(null), Joi.string().regex(/^\d{10}$/)),
      address: Joi.string(),
      city: Joi.string(),
      state: Joi.string().valid(...Object.values(State)),
      postalCode: Joi.string(),
      support: Joi.array().items(Joi.string().valid(...Object.values(Support))),
      gender: Joi.valid(...Object.values(Gender), null),
      orientation: Joi.valid(...Object.values(Orientation), null),
      religion: Joi.valid(...Object.values(Religion), null),
      maritalStatus: Joi.valid(...Object.values(MaritalStatus), null),
      age: Joi.valid(...Object.values(Age), null),
      disability: Joi.alternatives().try(Joi.any().valid(null), Joi.boolean()),
      ethnicity: Joi.valid(...Object.values(Ethnicity), null),
      veteranStatus: Joi.valid(...Object.values(VeteranStatus), null),
      referredBy: Joi.string().valid(...Object.values(ReferredBy)),
      personalStrengths: Joi.array().items(Joi.string().valid(...Object.values(PersonalStrengths))),
      experience: Joi.array().items(Joi.string().valid(...Object.values(ExperienceSkills))),
      languages: Joi.array().items(
        Joi.object().keys({
          language: Joi.string().valid(...Object.values(Language)),
          level: Joi.string().valid(...Object.values(LanguageLevel)),
        }),
      ),
      offense: Joi.array().items(Joi.string().valid(...Object.values(OffenseCategory))),
      sexualOffenderRegistry: Joi.alternatives().try(Joi.any().valid(null), Joi.boolean()),
      sbn: Joi.alternatives().try(Joi.any().valid(null), Joi.boolean()),
      timeServed: Joi.valid(...Object.values(TimeServed), null),
      releasedAt: Joi.valid(...Object.values(ReleasedAt), null),
      stateOrFederal: Joi.valid(...Object.values(StateFederal), null),
      relativeExperience: Joi.array().items(
        Joi.object().keys({
          title: Joi.string(),
          company: Joi.string(),
          startAtMonth: Joi.string().regex(/^(1[0-2]|[1-9])$/),
          startAtYear: Joi.string().regex(/^\d{4}$/),
          endAtMonth: Joi.string().regex(/^(1[0-2]|[1-9])$/),
          endAtYear: Joi.string().regex(/^\d{4}$/),
          location: Joi.string(),
          description: Joi.string().max(500),
        }),
      ),
      personalSummary: Joi.string().max(1000),
      education: Joi.array().items(
        Joi.object().keys({
          schoolIssuer: Joi.string(),
          degree: Joi.string(),
          areaOfStudy: Joi.string(),
          startYear: Joi.string().regex(/^\d{4}$/),
          yearEarned: Joi.string().regex(/^\d{4}$/),
          description: Joi.string().max(500),
        }),
      ),
      license: Joi.array().items(
        Joi.object().keys({
          licenseName: Joi.string(),
          issuingOrganization: Joi.string(),
          issueAtMonth: Joi.string().regex(/^(1[0-2]|[1-9])$/),
          issueAtYear: Joi.string().regex(/^\d{4}$/),
          expirationAtMonth: Joi.string().regex(/^(1[0-2]|[1-9])$/),
          expirationAtYear: Joi.string().regex(/^\d{4}$/),
        }),
      ),

      // VeteranOrJustice justiceImpacted
      veteranService: Joi.array().items(
        Joi.string().valid(...Object.values(VeteranBranchOfService)),
      ),
      veteranRank: Joi.string().valid(...Object.values(VeteranRank)),
      veteranStartAt: Joi.string().regex(/^\d{4}-(0?[1-9]|1[012])-(0?[1-9]|[12][0-9]|3[01])$/),
      veteranEndAt: Joi.string().regex(/^\d{4}-(0?[1-9]|1[012])-(0?[1-9]|[12][0-9]|3[01])$/),
      veteranReservist: Joi.boolean(),
      veteranCampaigns: Joi.array().items(Joi.string().valid(...Object.values(VeteranCampaign))),
      veteranTypeDischarge: Joi.string().valid(...Object.values(VeteranTypeDischarge)),
      veteranDd214: Joi.boolean(),
    }),
  }),
  async (ctx: Context<ClientType & { avatar: string }>) => {
    const userId = ctx.auth.userId as string;

    const client = await Client.transaction(async (trx) => {
      const { firstName, lastName, phone, email, avatar, ...patch } = ctx.request.body;

      const patchClient = await Client.query(trx)
        .findById(ctx.param('id'))
        .where({ userId })
        .patch({ ...patch, firstName, lastName, phone })
        .returning('*')
        .first()
        .throwIfNotFound();

      await User.query(trx)
        .findById(patchClient.userId)
        .patch({ firstName, lastName, email, avatar, ...(phone && { phone }) });

      const client = await patchClient
        .$query(trx)
        .select(['clients.*', 'users.avatar'])
        .leftJoin('users', (join: Knex.JoinClause) => {
          join.on('clients.userId', 'users.id');
        });

      return client;
    });

    ctx.send(Client.serialize(client, { ctx }));
  },
);

/**
 * DELETE /clients/:id/rsp
 * Remove rsp client relation
 */
router.delete('/rsp', guard(['admin']), async (ctx: Context<ClientType>) => {
  const client = await Client.query()
    .findById(ctx.param('id'))
    .returning('*')
    .first()
    .throwIfNotFound();

  await RspClient.query().where({ userId: client.userId }).delete();

  ctx.ok();
});

export { router };

export const routes = (): Middleware => cloneDeep(router.routes());
