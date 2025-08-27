import { Context, guard, Joi, Router, validator } from '@disruptive-labs/server';
import { Industry, MediaType, NumberOfEmployers, State, YearsInBusiness } from '@two/shared';
import { NotFoundError } from '@app/models';
import { Employer } from '@app/models/Employer';

const router = new Router();

/**
 * PATCH employers/:id
 * Update employer
 *
 * Updates employer profile
 */
router.patch(
  '/',
  guard(['employer']),
  validator({
    body: Joi.object().keys({
      name: Joi.string(),
      industry: Joi.string().valid(...Object.values(Industry)),
      description: Joi.string(),
      yearsInBusiness: Joi.string().valid(...Object.values(YearsInBusiness)),
      numberOfEmployees: Joi.string().valid(...Object.values(NumberOfEmployers)),
      address: Joi.string(),
      city: Joi.string(),
      state: Joi.string().valid(...Object.values(State)),
      postalCode: Joi.string(),
      availableJobsCount: Joi.number().admin(),
      availableProfilesUncloak: Joi.number().admin(),
      avatar: Joi.string()
        .uri({ relativeOnly: true })
        .regex(new RegExp(`^${MediaType.Avatar}\\/[-\\w]+\\.\\w+$`))
        .trim(),
    }),
  }),
  async (ctx: Context) => {
    try {
      const userId = ctx.auth.userId as string;
      const isAdmin = ctx.auth.has('admin');

      const employer = await Employer.query()
        .findById(ctx.param('id'))
        .where((builder) => {
          if (!isAdmin) {
            builder.where({ userId });
          }
        })
        .patch(ctx.request.body)
        .returning('*')
        .first()
        .throwIfNotFound();

      ctx.send(Employer.serialize(employer, { ctx }));
    } catch (err) {
      if (err instanceof NotFoundError) {
        throw ctx.resourceNotFound(`Employer ${ctx.param('id')} not found`);
      }

      /* istanbul ignore next: rethrow unknown error */
      throw err;
    }
  },
);

export { router };
