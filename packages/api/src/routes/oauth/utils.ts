import JWT from 'jsonwebtoken';
import config from '@two/config';
import { AccessTokenClaims } from '@two/shared';

export function generateAccessToken<Claims extends AccessTokenClaims>(
  claims: Claims,
  options?: Partial<JWT.SignOptions>,
): string {
  return JWT.sign(claims, config.get<string>('api.auth.secret', ''), {
    algorithm: config.get('api.auth.algorithm', 'HS256'),
    audience: config.get('api.auth.audience', 'api'),
    expiresIn: config.get('api.auth.ttl', 3600),
    issuer: config.get('api.auth.issuer', 'api'),
    ...options,
  });
}
