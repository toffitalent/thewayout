import { Context, guard, Joi, Next, Router, validator } from '@disruptive-labs/server';
import crypto from 'crypto';
import { promisify } from 'util';
import config from '@two/config';
import { App, NotFoundError } from '@app/models';

const randomBytes = promisify(crypto.randomBytes);

const router = new Router();

// Require self scope for all routes
router.use('/', guard(['self']));

type AuthorizationsRequestContext<Body = unknown> = Context<
  Body,
  { appId?: string },
  Record<string, never>,
  { app: App }
>;

// Load app to ctx.state.app
router.use(
  '/:appId',
  validator({ params: Joi.object().keys({ appId: Joi.string().uuid() }) }),
  async (ctx: AuthorizationsRequestContext, next: Next) => {
    try {
      ctx.state.app = await App.query().findById(ctx.param('appId')).throwIfNotFound();
    } catch (err) {
      if (err instanceof NotFoundError) {
        throw ctx.resourceNotFound(`App ${ctx.param('appId')} not found`);
      }

      /* istanbul ignore next: rethrow unknown error */
      throw err;
    }

    await next();
  },
);

/**
 * GET /oauth/authorizations/:appId
 * Get app authorization details for user
 */
router.get('/:appId', async (ctx: AuthorizationsRequestContext) => {
  try {
    const appUser = await ctx.state.app
      .$relatedQuery('users')
      .where('userId', ctx.auth.userId)
      .withGraphFetched('user')
      .first()
      .throwIfNotFound();

    appUser.$setRelated('app', ctx.state.app);

    ctx.send(appUser.serialize({ ctx }));
  } catch (err) {
    if (err instanceof NotFoundError) {
      throw ctx.resourceNotFound(`App authorization for app ${ctx.param('appId')} not found`);
    }

    /* istanbul ignore next: rethrow unknown error */
    throw err;
  }
});

/**
 * POST /oauth/authorizations/:appId
 * Replace/create app authorization for user with scope
 */

interface CreateAuthorizationCodeRequestBody {
  clientId: string;
}

router.post(
  '/:appId',
  validator({
    body: Joi.object().keys({
      clientId: Joi.string().uuid().required(),
    }),
  }),
  async (ctx: AuthorizationsRequestContext<CreateAuthorizationCodeRequestBody>) => {
    try {
      const { clientId } = ctx.request.body;

      // Validate app client
      const client = await ctx.state.app
        .$relatedQuery('clients')
        .findById(clientId)
        .throwIfNotFound();

      // Create authorization code
      const buffer = await randomBytes(16);
      const code = buffer.toString('hex');

      // Add code to Redis for authorization code grant (expires in 15 mins)
      await ctx.store().set(`oauth:${client.id}:${code}`, ctx.auth.userId!, 'EX', 900);

      ctx.created({
        appId: ctx.param('appId'),
        clientId,
        code,
      });
    } catch (err) {
      if (err instanceof NotFoundError) {
        throw ctx.invalidRequest(`Client ${ctx.request.body.clientId} not found`, {
          key: 'clientId',
        });
      }

      /* istanbul ignore next: rethrow unknown error */
      throw err;
    }
  },
);

/**
 * PUT /oauth/authorizations/:appId
 * Replace/create app authorization
 *
 * Adds app authorization for user with specified scope
 */

interface CreateAuthorizationRequestBody {
  scope: string[];
}

router.put(
  '/:appId',
  validator({
    body: Joi.object().keys({
      scope: Joi.array()
        .items(Joi.string().valid(...config.get('api.auth.scopes', [])))
        .required()
        .unique(),
    }),
  }),
  async (ctx: AuthorizationsRequestContext<CreateAuthorizationRequestBody>) => {
    const scope = ctx.request.body.scope.sort();

    // Attempt to update record
    const updated = await ctx.state.app
      .$relatedQuery('users')
      .patch({ scope })
      .where({ userId: ctx.auth.userId });

    if (!updated) {
      await ctx.state.app
        .$relatedQuery('users')
        .insert({ userId: ctx.auth.userId as string, scope });
    }

    ctx.ok();
  },
);

export { router };
