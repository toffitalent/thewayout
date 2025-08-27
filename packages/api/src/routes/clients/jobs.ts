import { Context, guard, Joi, paginate, Router, validator } from '@disruptive-labs/server';
import { Knex } from 'knex';
import { JobApplicationStatus, JobStatus, VeteranOrJustice } from '@two/shared';
import { knex } from '@app/db';
import { Client, Job, JobListItemSerializer } from '@app/models';

const router = new Router();
const jobsListItemSerializer = new JobListItemSerializer();

/**
 * GET /clients/:id/jobs
 * Get all client jobs
 *
 */
router.get(
  '/',
  guard(['client']),
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
  async (ctx: Context) => {
    const userId = ctx.auth.userId as string;
    const client = await Client.query().where({ userId }).first();
    const { since } = ctx.query;

    if (!client) {
      throw ctx.invalidRequest('Client profile not found', { key: 'profile' });
    }

    const { results, ...pagination } = await Job.query()
      .select([
        'jobs.*',
        'job_applications.clientId',
        'job_applications.status as applicationStatus',
      ])
      .where('job_applications.clientId', client.id)
      .leftJoin('job_applications', (join: Knex.JoinClause) => {
        join
          .on('jobs.id', 'job_applications.jobId')
          .andOn('job_applications.clientId', '=', knex.raw('?', [client?.id as any]));
      })
      .where((builder) => {
        if (since) {
          builder.andWhere('jobs.updatedAt', '>', since);
        }
      })
      .where('jobs.status', JobStatus.active)
      .orderBy('id', 'DESC')
      .paginate(ctx.pagination!);

    ctx.send(jobsListItemSerializer.serialize(results, { ctx }));
    ctx.pagination!.meta = pagination;
  },
);

/**
 * GET /clients/:id/jobs/suggested
 * Get suggested jobs for client
 *
 */
router.get('/suggested', guard(['client']), async (ctx: Context) => {
  const userId = ctx.auth.userId as string;
  const client = await Client.query().findById(ctx.param('id')).where({ userId });

  if (!client) {
    throw ctx.invalidRequest('Client profile not found', { key: 'profile' });
  }

  const results = await Job.query()
    .select([
      'jobs.*',
      'job_applications.clientId',
      Job.relatedQuery('applications')
        .where('status', 'in', [
          JobApplicationStatus.applied,
          JobApplicationStatus.hired,
          JobApplicationStatus.interview,
        ])
        .count()
        .as('applicationsCount'),
    ])
    .leftJoin('job_applications', (join: Knex.JoinClause) => {
      join
        .on('jobs.id', 'job_applications.jobId')
        .andOn('job_applications.clientId', '=', knex.raw('?', [client?.id as any]));
    })
    .whereNull('job_applications')
    .orderBy('id', 'DESC')
    .where((builder) => {
      if (client.veteranOrJustice.includes(VeteranOrJustice.justiceImpacted)) {
        builder.andWhere('jobs.offenses', '@>', client.offense);
      }
    })
    .where('jobs.veteran_or_justice', '&&', client.veteranOrJustice)
    .where('jobs.status', JobStatus.active)
    .limit(3);

  ctx.send(jobsListItemSerializer.serialize(results, { ctx }));
});

export { router };
