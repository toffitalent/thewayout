import JWT from 'jsonwebtoken';
import type { Request } from 'supertest';
import config from '@two/config';
import * as fixtures from '@app/db/fixtures';

export function auth(sub = fixtures.user1.id, scope = ['self']) {
  const payload = {
    sub,
    azp: fixtures.app.id,
    client_id: fixtures.client.id,
    scope: scope.join(', '),
  };

  const token = JWT.sign(payload, config.get<string>('api.auth.secret', ''), {
    algorithm: config.get('api.auth.algorithm', 'HS256'),
    audience: config.get('api.auth.audience', 'api'),
    issuer: config.get('api.auth.issuer', 'api'),
    expiresIn: 15,
  });

  return (request: Request) => request.set('Authorization', `Bearer ${token}`);
}
