import { Context, guard, Joi, Router, validator } from '@disruptive-labs/server';
import {
  EmployerCreateRequest,
  Industry,
  NumberOfEmployers,
  State,
  YearsInBusiness,
} from '@two/shared';
import { Employer } from '@app/models/Employer';
import { router as employer } from './employer';
import { router as jobs } from './jobs';

const router = new Router();

/**
 * POST /employers
 * Create employer
 *
 * Adds a new employer profile
 */

router.post(
  '/',
  guard(['employer']),
  validator({
    body: Joi.object().keys({
      name: Joi.string().required(),
      industry: Joi.string()
        .valid(...Object.values(Industry))
        .required(),
      description: Joi.string().required().max(1000),
      yearsInBusiness: Joi.string()
        .valid(...Object.values(YearsInBusiness))
        .required(),
      numberOfEmployees: Joi.string()
        .valid(...Object.values(NumberOfEmployers))
        .required(),
      address: Joi.string().required(),
      city: Joi.string().required(),
      state: Joi.string()
        .valid(...Object.values(State))
        .required(),
      postalCode: Joi.string().required(),
    }),
  }),
  async (ctx: Context<EmployerCreateRequest>) => {
    const userId = ctx.auth.userId as string;
    const employer = await Employer.query().where({ userId }).first();

    if (employer) {
      throw ctx.resourceConflict(`Profile already exist`);
    }
    const newEmployer = await Employer.query()
      .insert({ ...ctx.request.body, userId })
      .returning('*');

    ctx.send(Employer.serialize(newEmployer, { ctx }));
  },
);

router.mount('/:id/jobs', jobs);
router.mount('/:id', employer);

export { router };
