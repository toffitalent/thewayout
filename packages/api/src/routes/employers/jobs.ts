import { Context, guard, Joi, paginate, Router, validator } from '@disruptive-labs/server';
import { ParsedUrlQuery } from 'querystring';
import * as Mail from '@two/mail';
import { JobApplicationStatus } from '@two/shared';
import { knex } from '@app/db';
import {
  Client,
  ClientCloakedSerializer,
  Job,
  JobApplication,
  JobListItemSerializer,
  NotFoundError,
  User,
} from '@app/models';
import { Employer } from '@app/models/Employer';
import { JobApplicationListItemSerializer } from '@app/models/serializers';
import * as Slack from '@app/services/Slack';

const router = new Router();
const jobsListItemSerializer = new JobListItemSerializer();
const clientCloakedSerializer = new ClientCloakedSerializer();
const jobApplicationListItemSerializer = new JobApplicationListItemSerializer();

interface JobsSearchParams extends ParsedUrlQuery {
  page?: string;
  since?: string;
  after?: string;
  before?: string;
  limit?: string;
}

export type JobsRequestContext<Body = unknown> = Context<
  Body,
  { id?: string },
  Record<string, never>,
  JobsSearchParams
>;

/**
 * GET /employers/:id/jobs
 * Get all employer jobs
 *
 */
router.get(
  '/',
  guard(['employer']),
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
    const userId = ctx.auth.userId as string;
    const employer = await Employer.query().where({ userId }).first();
    const { since } = ctx.query;

    if (ctx.param('id') !== userId) {
      throw ctx.notAuthorized('You cant get not yours jobs');
    }
    if (!employer) {
      throw ctx.invalidRequest('Employer profile not found', { key: 'profile' });
    }

    const { results, ...pagination } = await Job.query()
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
          .where({ status: JobApplicationStatus.applied })
          .count()
          .as('pendingApplicationsCount'),
      ])
      .where({ employerId: employer.id })
      .orderBy('id', 'DESC')
      .where((builder) => {
        if (since) {
          builder.andWhere('jobs.updatedAt', '>', since);
        }
      })
      .paginate(ctx.pagination!);

    ctx.send(jobsListItemSerializer.serialize(results, { ctx }));
    ctx.pagination!.meta = pagination;
  },
);

/**
 * GET /employers/:id/jobs/:jobId/applications
 * Get all job applications
 *
 */

router.get(
  '/:jobId/applications',
  guard(['employer']),
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
  async (ctx: Context<{ jobId: string }>) => {
    const userId = ctx.auth.userId as string;
    const job = await Job.query().findById(ctx.param('jobId')).withGraphFetched('employer');

    if (job?.employer?.userId !== userId) {
      throw ctx.notAuthorized('You cant get not yours job applications');
    }

    const query = Client.query()
      .select([
        'clients.firstName',
        'clients.lastName',
        'clients.phone',
        'users.email',
        'users.avatar',
        'job_applications.*',
        knex.raw(
          `CASE WHEN status = ? THEN 5 WHEN status = ? THEN 4 WHEN status = ? THEN 3 WHEN status = ? THEN 1 ELSE 2 END AS ??`,
          [
            JobApplicationStatus.rejected,
            JobApplicationStatus.notAFit,
            JobApplicationStatus.hired,
            JobApplicationStatus.interview,
            'sortStatus',
          ],
        ),
      ])
      .innerJoin('users', 'clients.userId', 'users.id')
      .innerJoin('job_applications', (join) =>
        join
          .on('clients.id', 'job_applications.clientId')
          .andOn('job_applications.jobId', '=', knex.raw('?', [ctx.param('jobId')])),
      )
      .orderBy('sortStatus', 'ASC')
      .orderBy('job_applications.id', 'DESC');

    ctx.pagination!.meta.total = await query.resultSize();

    const { results } = await query.page(ctx.query.page, ctx.pagination!.limit);

    ctx.send(jobApplicationListItemSerializer.serialize(results, { ctx }));
  },
);

/**
 * GET /employers/:id/jobs/:jobId/applications/:clientId
 * Get client information
 *
 */

router.get(
  '/:jobId/applications/:clientId',
  guard(['employer']),
  validator({
    params: Joi.object().keys({
      clientId: Joi.string().required(),
    }),
    query: Joi.object({
      since: Joi.date(),
    }),
  }),
  async (ctx: Context<{ clientId: string }>) => {
    try {
      const jobApplication = await JobApplication.query()
        .where('jobId', ctx.param('jobId'))
        .andWhere('clientId', ctx.param('clientId'))
        .first();

      if (!jobApplication) {
        throw ctx.invalidRequest(
          'You cant get information about client that not apply to your job',
          { key: 'clientId' },
        );
      }

      const client = await Client.query()
        .select([
          'clients.*',
          'users.email as email',
          'users.avatar',
          'job_applications.status as applicationStatus',
          'job_applications.id as applicationId',
          'job_applications.questions as questions',
        ])
        .where('clients.id', ctx.param('clientId'))
        .innerJoin('users', 'clients.userId', 'users.id')
        .innerJoin('job_applications', (join) =>
          join
            .on('clients.id', 'job_applications.clientId')
            .andOn('job_applications.jobId', '=', knex.raw('?', [ctx.param('jobId')])),
        )
        .first()
        .throwIfNotFound();

      if (
        ctx.query.since &&
        new Date(ctx.query.since).getTime() >= new Date(client.updatedAt).getTime()
      ) {
        ctx.ok();
        return;
      }
      ctx.send(
        jobApplication.status === JobApplicationStatus.applied ||
          jobApplication.status === JobApplicationStatus.notAFit
          ? clientCloakedSerializer.serialize(client, { ctx })
          : Client.serialize(client, { ctx }),
      );
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
 * PATCH /employers/:id/jobs/:jobId/applications/:applicationId
 * PATCH change application status
 *
 */

router.patch(
  '/:jobId/applications/:applicationId',
  guard(['employer']),
  validator({
    body: Joi.object().keys({
      status: Joi.string().valid(...Object.values(JobApplicationStatus)),
    }),
  }),
  async (ctx: Context<{ status: JobApplicationStatus }>) => {
    try {
      const job = await Job.query()
        .findById(ctx.param('jobId'))
        .withGraphFetched('employer')
        .throwIfNotFound();

      if (job.employer?.userId !== ctx.auth.userId || job.employerId !== ctx.param('id')) {
        throw ctx.notAuthorized('You cant update not yours job applications');
      }

      if (
        ctx.request.body.status === JobApplicationStatus.interview &&
        !job.employer.availableProfilesUncloak
      ) {
        Slack.alert(`User ${ctx.auth.userId} exceeded limit of profile uncloak`);
        throw ctx.paymentDeclined('Exceeded limit of profile uncloak');
      }

      const jobApplication = await JobApplication.transaction(async (trx) => {
        const newJobApplication = await JobApplication.query(trx)
          .patch({ status: ctx.request.body.status })
          .findById(ctx.param('applicationId'))
          .withGraphFetched('client')
          .returning('*')
          .throwIfNotFound();

        if (ctx.request.body.status === JobApplicationStatus.interview) {
          await Employer.query(trx)
            .where({ userId: ctx.auth.userId })
            .where('availableProfilesUncloak', '>', 0)
            .decrement('availableProfilesUncloak', 1)
            .throwIfNotFound();
        }

        return newJobApplication;
      });

      const clientUser = await User.query()
        .findById(jobApplication.client!.userId)
        .throwIfNotFound();

      if (ctx.request.body.status === JobApplicationStatus.interview) {
        Mail.send(
          { to: { address: clientUser.email, name: clientUser.name } },
          'RequestInterview',
          { client: { firstName: clientUser.firstName }, offerTitle: job.title },
        );
      }

      if (ctx.request.body.status === JobApplicationStatus.hired) {
        Mail.send({ to: { address: clientUser.email, name: clientUser.name } }, 'HireApplicant', {
          client: { firstName: clientUser.firstName },
          offerTitle: job.title,
          company: { name: job.employer!.name },
        });
      }

      if (ctx.request.body.status === JobApplicationStatus.rejected) {
        Mail.send({ to: { address: clientUser.email, name: clientUser.name } }, 'RejectApplicant', {
          client: { firstName: clientUser.firstName },
          offerTitle: job.title,
        });
      }

      ctx.send(JobApplication.serialize(jobApplication, { ctx }));
    } catch (err) {
      if (err instanceof NotFoundError) {
        throw ctx.resourceConflict(`Application not found`);
      }

      /* istanbul ignore next: rethrow unknown error */
      throw err;
    }
  },
);

export { router };
