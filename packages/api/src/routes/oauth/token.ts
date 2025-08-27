import { Context, guard, Joi, Router, validator } from '@disruptive-labs/server';
import {
  AuthGrantType,
  AuthorizationCodeAuthRequest,
  PasswordAuthRequest,
  RefreshTokenAuthRequest,
} from '@two/shared';
import { AppClient, AppToken, AppUser, NotFoundError, User } from '@app/models';
import { generateAccessToken } from './utils';

async function generateTokenResponse(
  client: AppClient,
  userId: string,
  scopes: string[],
  roles?: string[],
) {
  const scope = scopes.filter(Boolean).join(' ');

  const refreshToken = await AppToken.query()
    .insert({
      appId: client.appId,
      clientId: client.id,
      self: scopes.includes('self'),
      userId,
    })
    .returning('*');

  const accessToken = generateAccessToken({
    jti: refreshToken.id,
    sub: userId,
    azp: client.appId,
    client_id: client.id,
    scope,
    roles,
  });

  return {
    tokenType: 'Bearer',
    accessToken,
    refreshToken: refreshToken.token.toString('base64'),
    scope,
    roles,
  };
}

interface TokenRequestState {
  client: AppClient;
}

type OAuthRequestContext<Body = unknown> = Context<
  Body,
  unknown,
  Record<string, never>,
  TokenRequestState
>;

const grants = {
  [AuthGrantType.AuthorizationCode]: async (
    ctx: OAuthRequestContext<AuthorizationCodeAuthRequest>,
  ) => {
    try {
      const { code } = ctx.request.body;
      const { client } = ctx.state;

      // Retrieve access code from Redis
      const userId = await ctx.store().get(`oauth:${client.id}:${code}`);
      if (!userId) throw ctx.invalidRequest('Authorization code is invalid', { key: 'code' });

      // Determine authorized scopes for app
      const authorization: AppUser = await AppUser.query()
        .select('scope')
        .findOne({ appId: client.appId, userId })
        .throwIfNotFound();

      ctx.send(await generateTokenResponse(client, userId, authorization.scope));

      // Delete access code to prevent replay
      await ctx.store().del(`oauth:${client.id}:${code}`);
    } catch (err) {
      if (err instanceof NotFoundError) {
        throw ctx.notAuthorized(`App ${ctx.state.client.appId} is not authorized`);
      }

      /* istanbul ignore next: rethrow unknown error */
      throw err;
    }
  },
  [AuthGrantType.Password]: async (ctx: OAuthRequestContext<PasswordAuthRequest>) => {
    const { username, password } = ctx.request.body;
    const { client } = ctx.state;

    const user = await User.query().findOne({ username });

    // Verify user exists & password matches
    if (!user || !(await user.verifyPassword(password))) {
      throw ctx.invalidCredentials('Invalid username/password');
    }

    // Include self role AND any authorized user roles
    ctx.send(await generateTokenResponse(client, user.id, ['self', ...user.roles], user.roles));
  },
  [AuthGrantType.RefreshToken]: async (ctx: OAuthRequestContext<RefreshTokenAuthRequest>) => {
    try {
      const { refreshToken: token } = ctx.request.body;
      const { client } = ctx.state;

      const { id, appId, self, userId } = await AppToken.query()
        .where('token', Buffer.from(token, 'base64'))
        .first()
        .throwIfNotFound();

      // Check refresh token issued to the same app as requesting client
      if (ctx.state.client.appId !== appId) {
        throw ctx.invalidRequest('Refresh token is invalid', { key: 'refreshToken' });
      }

      // Token scope
      let roles: string[] | undefined;
      let scope: string[] = [];

      if (self) {
        // Retrieve user to get authorized roles
        const user = await User.query().findById(userId).throwIfNotFound();

        // Add self role (from password grant) and any authorized user roles
        scope = ['self', ...user.roles];
        roles = user.roles;
      } else {
        // Include all authorized scopes for app
        ({ scope } = await AppUser.query()
          .select('scope')
          .findOne({ appId, userId })
          .throwIfNotFound());
      }

      ctx.send(await generateTokenResponse(client, userId, scope, roles));

      // Delete previous refresh token to prevent reuse
      await AppToken.query().delete().where('id', id);
    } catch (err) {
      if (err instanceof NotFoundError) {
        throw ctx.invalidRequest('Refresh token is invalid', { key: 'refreshToken' });
      }

      /* istanbul ignore next: rethrow unknown error */
      throw err;
    }
  },
};

const router = new Router();

/**
 * GET /oauth/token
 * Get auth token information
 */
router.get('/', guard(), async (ctx: Context<unknown>) => {
  ctx.send({
    appId: ctx.auth.azp,
    clientId: ctx.auth.client_id,
    userId: ctx.auth.sub,
    roles: ctx.auth.roles,
    scope: ctx.auth.scope.join(' '),
    expiresAt: ctx.auth.exp,
    expiresIn: Math.max(0, ctx.auth.exp - Math.floor(Date.now() / 1000)),
  });
});

/**
 * POST /oauth/token
 * Create a new access token
 *
 * Supported grant types: authorizationCode, password, refreshToken
 */

router.post(
  '/',
  validator({
    body: Joi.object().keys({
      clientId: Joi.string().uuid().required(),
      clientSecret: Joi.string().required(),
      grantType: Joi.string()
        .valid(...Object.values(AuthGrantType))
        .required(),
      // Authorization code grant
      code: Joi.string()
        .alphanum()
        .when('grantType', { is: AuthGrantType.AuthorizationCode, then: Joi.required() }),
      // Password grant
      username: Joi.string()
        .lowercase()
        .trim()
        .when('grantType', { is: AuthGrantType.Password, then: Joi.required() }),
      password: Joi.string().when('grantType', {
        is: AuthGrantType.Password,
        then: Joi.required(),
      }),
      // Refresh token grant
      refreshToken: Joi.string()
        .base64()
        .when('grantType', { is: AuthGrantType.RefreshToken, then: Joi.required() }),
    }),
  }),
  async (
    ctx: OAuthRequestContext<
      AuthorizationCodeAuthRequest | PasswordAuthRequest | RefreshTokenAuthRequest
    >,
  ) => {
    try {
      ctx.state.client = await AppClient.query()
        .findById(ctx.request.body.clientId)
        .throwIfNotFound();

      // Validate client secret
      if (ctx.state.client.secret !== ctx.request.body.clientSecret) {
        throw ctx.invalidRequest('Client secret does not match', { key: 'clientSecret' });
      }

      // Validate client is authorized for request grant type
      if (
        ctx.request.body.grantType !== AuthGrantType.RefreshToken &&
        ctx.state.client.grantType !== ctx.request.body.grantType
      ) {
        throw ctx.invalidRequest(`Client not authorized for ${ctx.request.body.grantType} grant`, {
          key: 'grantType',
        });
      }

      await grants[ctx.request.body.grantType](ctx as any);
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
 * DELETE /oauth/token
 * Delete associated refresh token
 */
router.delete('/', guard(), async (ctx: Context<unknown>) => {
  await AppToken.query().delete().where('id', ctx.auth.jti);
  ctx.ok();
});

export { router };
