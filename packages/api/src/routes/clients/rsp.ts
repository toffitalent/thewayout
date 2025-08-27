import { Context, guard, Joi, Router, validator } from '@disruptive-labs/server';
import { ListRspClientRequest, OffenseCategory, Support, VeteranOrJustice } from '@two/shared';
import { Rsp } from '@app/models';
import { RspListItemSerializer } from '@app/models/serializers';

const router = new Router();

const rspListItemSerializer = new RspListItemSerializer();

export type ClientRspRequestContext<Body = unknown> = Context<
  Body,
  { id?: string },
  Record<string, never>,
  ListRspClientRequest
>;

/**
 * GET /clients/:id/rsp
 * Get all rsp for client
 *
 */
router.get(
  '/',
  guard(['client']),
  validator({
    query: Joi.object({
      support: Joi.array()
        .items(Joi.string().valid(...Object.values(Support)))
        .delimeter(','),
      offenses: Joi.array()
        .items(Joi.string().valid(...Object.values(OffenseCategory)))
        .delimeter(','),
      county: Joi.string(),
      veteranOrJustice: Joi.array()
        .items(Joi.string().valid(...Object.values(VeteranOrJustice)))
        .delimeter(','),
    }),
  }),
  async (ctx: ClientRspRequestContext) => {
    const { support, offenses, county, veteranOrJustice } = ctx.query;

    const results = await Rsp.query()
      .orderBy('id', 'DESC')
      .where((builder) => {
        if (support) {
          builder.where('support', '&&', support);
        }
        if (offenses) {
          builder.where('offenses', '@>', offenses);
        }
        if (county) {
          builder.where('servicesArea', '@>', [county]);
        }
        if (veteranOrJustice) {
          builder.where('veteranOrJustice', '&&', veteranOrJustice);
        }
      });

    ctx.send(rspListItemSerializer.serialize(results, { ctx }));
  },
);

export { router };
