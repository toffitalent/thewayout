import { Context, guard, Joi, Router, validator } from '@disruptive-labs/server';
import {
  Experience,
  JobApplicationStatus,
  JobSalaries,
  JobStatus,
  OffenseCategory,
  State,
  TypeOfWork,
  VeteranOrJustice,
  WorkingTime,
} from '@two/shared';
import { Client, Employer, Job, JobSerializer, NotFoundError } from '@app/models';
import type { JobsRequestContext } from '.';

const router = new Router();
const jobSerializer = new JobSerializer();

/**
 * GET jobs/:jobId
 * Get a job
 *
 * Returns a job information
 */
router.get(
  '/',
  validator({
    params: Joi.object().keys({
      jobId: Joi.string().required(),
    }),
    query: Joi.object({
      since: Joi.date(),
    }),
  }),
  async (ctx: JobsRequestContext) => {
    const userId = ctx.auth.userId as string;
    const client = await Client.query().where({ userId }).first();
    const employer = await Employer.query().where({ userId }).first();
    const isAdmin = ctx.auth.has('admin');

    try {
      const jobQuery = Job.query().findById(ctx.param('jobId'));
      if (client) {
        jobQuery.withGraphFetched('applications').modifyGraph('applications', (builder) => {
          builder.where('clientId', '=', client?.id || '');
        });
      }
      if (employer) {
        jobQuery.select(
          'jobs.*',
          Job.relatedQuery('applications')
            .where('status', 'in', [
              JobApplicationStatus.applied,
              JobApplicationStatus.hired,
              JobApplicationStatus.interview,
            ])
            .count()
            .as('applicationsCount'),
          Job.relatedQuery('applications')
            .where('status', 'in', [JobApplicationStatus.applied])
            .count()
            .as('pendingApplicationsCount'),
          Job.relatedQuery('applications')
            .where('status', 'in', [JobApplicationStatus.hired])
            .count()
            .as('hiredApplicationsCount'),
        );
      }
      if (!employer && !isAdmin) {
        jobQuery.where('status', JobStatus.active);
      }
      const job = await jobQuery.throwIfNotFound();
      const isJobOffensesAllowed = (client?.offense || []).every((el) =>
        (job?.offenses || []).includes(el),
      );
      if (!isJobOffensesAllowed) {
        throw ctx.invalidRequest('Job does not allow client offenses', { key: 'offense' });
      }
      if (
        ctx.query.since &&
        new Date(ctx.query.since).getTime() >= new Date(job.updatedAt).getTime()
      ) {
        ctx.ok();
        return;
      }
      ctx.send(jobSerializer.serialize(job, { ctx }));
    } catch (err) {
      if (err instanceof NotFoundError) {
        throw ctx.resourceNotFound(`Job ${ctx.param('jobId')} not found`);
      }
    }
  },
);

/**
 * PATCH jobs/:jobId
 * Update a job
 *
 */
router.patch(
  '/',
  guard(['employer']),
  validator({
    body: Joi.object().keys({
      title: Joi.string(),
      description: Joi.string(),
      department: Joi.string(),
      startDate: Joi.string(),
      typeOfWork: Joi.string().valid(...Object.values(TypeOfWork)),
      workingTime: Joi.string().valid(...Object.values(WorkingTime)),
      experience: Joi.string().valid(...Object.values(Experience)),
      numberOfOpenPositions: Joi.number(),
      offenses: Joi.alternatives().try(
        Joi.any().valid(null),
        Joi.array().items(Joi.string().valid(...Object.values(OffenseCategory))),
      ),
      responsibilities: Joi.array().items(Joi.string()),
      skillsDescription: Joi.string(),
      salaryOptions: Joi.object().keys({
        salary: Joi.string().valid(...Object.values(JobSalaries)),
        min: Joi.string(),
        max: Joi.string(),
        description: Joi.string(),
        bonuses: Joi.array().items(Joi.string()),
      }),
      location: Joi.alternatives().try(
        Joi.any().valid(null),
        Joi.object().keys({
          address: Joi.string(),
          city: Joi.string(),
          state: Joi.string().valid(...Object.values(State)),
          postalCode: Joi.string(),
        }),
      ),
      status: Joi.string().valid(...Object.values(JobStatus)),
      questions: Joi.array().items(Joi.string()),
      veteranOrJustice: Joi.array().items(Joi.string().valid(...Object.values(VeteranOrJustice))),
    }),
  }),
  async (ctx: Context) => {
    try {
      const job = await Job.query()
        .findById(ctx.param('jobId'))
        .withGraphFetched('employer')
        .select([
          'jobs.*',
          Job.relatedQuery('applications')
            .where('status', 'in', [
              JobApplicationStatus.applied,
              JobApplicationStatus.hired,
              JobApplicationStatus.interview,
            ])
            .count()
            .as('applicationsCount'),
          Job.relatedQuery('applications')
            .where('status', 'in', [JobApplicationStatus.hired])
            .count()
            .as('hiredApplicationsCount'),
        ])
        .throwIfNotFound();

      if (job.employer?.userId !== ctx.auth.userId) {
        throw ctx.notAuthorized('You cant update not your job');
      }

      await job.$query().patch(ctx.request.body).returning('*').first().throwIfNotFound();
      ctx.send(jobSerializer.serialize(job, { ctx }));
    } catch (err) {
      if (err instanceof NotFoundError) {
        throw ctx.resourceNotFound(`Job ${ctx.param('jobId')} not found`);
      }

      /* istanbul ignore next: rethrow unknown error */
      throw err;
    }
  },
);

export { router };
