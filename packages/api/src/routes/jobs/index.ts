import {
  Context,
  guard,
  Joi,
  paginate,
  Router,
  throttle,
  validator,
} from '@disruptive-labs/server';
import { ParsedUrlQuery } from 'querystring';
import {
  CreateJobRequest,
  Experience,
  JobSalaries,
  JobStatus,
  OffenseCategory,
  State,
  TypeOfWork,
  UserType,
  VeteranOrJustice,
  WorkingTime,
} from '@two/shared';
import { Client, Job, JobListItemSerializer } from '@app/models';
import { Employer } from '@app/models/Employer';
import { router as applications } from './applications';
import { router as job } from './job';

const router = new Router();

const jobsListItemSerializer = new JobListItemSerializer();

interface JobsSearchParams extends ParsedUrlQuery {
  page?: string;
  since?: string;
  after?: string;
  before?: string;
  limit?: string;
}

export type JobsRequestContext<Body = unknown> = Context<
  Body,
  { jobId?: string },
  Record<string, never>,
  JobsSearchParams
>;

/**
 * POST /jobs
 * Create job
 *
 * Adds a new job
 */

router.post(
  '/',
  guard(['employer']),
  throttle({ max: 1, duration: 60 }),
  validator({
    body: Joi.object().keys({
      title: Joi.string().required(),
      description: Joi.string().required(),
      department: Joi.string().required(),
      startDate: Joi.string().required(),
      typeOfWork: Joi.string()
        .valid(...Object.values(TypeOfWork))
        .required(),
      workingTime: Joi.string()
        .valid(...Object.values(WorkingTime))
        .required(),
      experience: Joi.string()
        .valid(...Object.values(Experience))
        .required(),
      numberOfOpenPositions: Joi.number().required(),
      offenses: Joi.array().items(Joi.string().valid(...Object.values(OffenseCategory))),
      responsibilities: Joi.array().items(Joi.string()).required(),
      skillsDescription: Joi.string().required(),
      salaryOptions: Joi.object()
        .keys({
          salary: Joi.string()
            .valid(...Object.values(JobSalaries))
            .required(),
          min: Joi.string().required(),
          max: Joi.string().required(),
          description: Joi.string().required(),
          bonuses: Joi.array().items(Joi.string()).required(),
        })
        .required(),
      location: Joi.alternatives().try(
        Joi.any().valid(null),
        Joi.object().keys({
          address: Joi.string().required(),
          city: Joi.string().required(),
          state: Joi.string()
            .valid(...Object.values(State))
            .required(),
          postalCode: Joi.string().required(),
        }),
      ),
      questions: Joi.array().items(Joi.string()),
      veteranOrJustice: Joi.array()
        .items(Joi.string().valid(...Object.values(VeteranOrJustice)))
        .required(),
    }),
  }),
  async (ctx: Context<CreateJobRequest>) => {
    const userId = ctx.auth.userId as string;
    const employer = await Employer.query().where({ userId }).first();
    if (!employer) {
      throw ctx.invalidRequest('Employer profile not found', { key: 'profile' });
    }

    if (!employer.availableJobsCount) {
      throw ctx.paymentDeclined('Exceeded limit of job creation');
    }
    const newJob = await Job.transaction(async (trx) => {
      const job = await Job.query(trx)
        .insert({ ...ctx.request.body, employerId: employer.id, status: JobStatus.active })
        .returning('*');

      await employer
        .$query()
        .where('availableJobsCount', '>', 0)
        .decrement('availableJobsCount', 1)
        .throwIfNotFound();

      return job;
    });

    ctx.send(Job.serialize(newJob, { ctx }));
  },
);

/**
 * GET /jobs
 * Get all jobs
 *
 */
router.get(
  '/',
  paginate({ encode: false, limit: 25, max: 250 }),
  validator({
    query: Joi.object({
      page: Joi.number().default(0),
      since: Joi.date(),
      before: Joi.string(),
      after: Joi.string(),
      limit: Joi.number(),
    }),
  }),
  async (ctx: JobsRequestContext) => {
    const { since } = ctx.query;
    const isAdmin = ctx.auth.has('admin');

    let client: Client | undefined;
    if (ctx.auth.roles.includes(UserType.Client)) {
      client = await Client.query().where({ userId: ctx.auth.userId }).first();
    }

    const { results, ...pagination } = await Job.query()
      .orderBy('id', 'DESC')
      .where((builder) => {
        if (since) {
          builder.andWhere('jobs.updatedAt', '>', since);
        }
        if (client && client.veteranOrJustice.includes(VeteranOrJustice.justiceImpacted)) {
          builder.andWhere('offenses', '@>', client.offense);
        }
        if (client) {
          builder.where('jobs.veteran_or_justice', '&&', client.veteranOrJustice);
        }
      })
      .where((builder) => {
        if (!isAdmin) {
          builder.where('status', JobStatus.active);
        }
      })
      .paginate(ctx.pagination!);

    ctx.send(jobsListItemSerializer.serialize(results, { ctx }));
    ctx.pagination!.meta = pagination;
  },
);

router.mount('/:jobId', job);
router.mount('/:jobId/applications', applications);

export { router };
