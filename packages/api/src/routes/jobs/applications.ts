import { Context, guard, Joi, Router, validator } from '@disruptive-labs/server';
import { raw } from 'objection';
import * as Mail from '@two/mail';
import { JobApplicationStatus, JusticeStatus } from '@two/shared';
import { Client, Job, JobApplication, UniqueViolationError, User } from '@app/models';

const router = new Router();

interface CreateApplicationRequest {
  jobId: string;
  questions?: { [key: string]: string }[];
}

/**
 * POST jobs/:jobId/applications
 * Create application
 *
 * Adds a new application
 */

router.post(
  '/',
  guard(['client']),
  validator({
    body: Joi.object().keys({
      questions: Joi.array().items(Joi.object()),
    }),
  }),
  async (ctx: Context<CreateApplicationRequest>) => {
    const userId = ctx.auth.userId as string;
    const client = await Client.query().where({ userId }).first();
    if (!client) {
      throw ctx.invalidRequest('Client profile not found', { key: 'profile' });
    }
    if (client.justiceStatus === JusticeStatus.currentlyIncarcerated) {
      throw ctx.invalidRequest(
        'Client with currently incarcerated justice status is not able to apply job',
        {
          key: 'currentlyIncarcerated',
        },
      );
    }
    const job = await Job.query().findById(ctx.param('jobId')).withGraphFetched('employer');

    const isJobOffensesAllowed = (client.offense || []).every((el) =>
      (job?.offenses || []).includes(el),
    );
    if (!isJobOffensesAllowed) {
      throw ctx.invalidRequest('Job does not allow client offenses', { key: 'offense' });
    }

    const isVeteranOrJusticeAllowed = (job?.veteranOrJustice || []).some((item) =>
      (client.veteranOrJustice || []).includes(item),
    );
    if (!isVeteranOrJusticeAllowed) {
      throw ctx.invalidRequest('Job does not allow client veteran or justice status', {
        key: 'veteranOrJustice',
      });
    }

    const lastApplications = await JobApplication.query()
      .where('clientId', client.id)
      .where('created_at', '>=', raw(`now() - (?*'1 HOUR'::INTERVAL)`, [24]));

    if (lastApplications.length >= 3) {
      throw ctx.requestThrottled('Maximum of 3 job applications per 24 hour period');
    }

    let application;
    try {
      application = await JobApplication.query()
        .insert({
          jobId: ctx.param('jobId'),
          clientId: client.id,
          status: JobApplicationStatus.applied,
          ...(ctx.request.body.questions && { questions: ctx.request.body.questions }),
        })
        .returning('*');

      if (job && job.employer) {
        const employerUser = await User.query().findById(job.employer.userId);
        const clientUser = await User.query().findById(userId);
        Promise.all([
          Mail.send(
            {
              to: { address: employerUser!.email, name: employerUser!.name },
            },
            'JobApplication',
            {
              employer: { firstName: employerUser!.firstName },
              offerTitle: job.title,
            },
          ),
          Mail.send(
            {
              to: { address: clientUser!.email, name: clientUser!.name },
            },
            'JobApplicationClient',
            {
              client,
              offerTitle: job.title,
            },
          ),
        ]);
      }
    } catch (err) {
      if (err instanceof UniqueViolationError) {
        throw ctx.resourceConflict(
          `Client ${client.id} already applied to job ${ctx.param('jobId')}`,
        );
      }

      throw err;
    }

    ctx.send(JobApplication.serialize(application, { ctx }));
  },
);

export { router };
