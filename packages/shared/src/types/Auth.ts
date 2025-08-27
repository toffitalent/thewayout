export enum AuthGrantType {
  AuthorizationCode = 'authorization_code',
  Password = 'password',
  RefreshToken = 'refresh_token',
}

interface AuthTokenBaseRequest {
  clientId: string;
  clientSecret: string;
  grantType: AuthGrantType;
}

export interface AuthorizationCodeAuthRequest extends AuthTokenBaseRequest {
  grantType: AuthGrantType.AuthorizationCode;
  code: string;
}

export interface PasswordAuthRequest extends AuthTokenBaseRequest {
  grantType: AuthGrantType.Password;
  username: string;
  password: string;
  mfa?: string;
}

export interface RefreshTokenAuthRequest extends AuthTokenBaseRequest {
  grantType: AuthGrantType.RefreshToken;
  refreshToken: string;
}

export interface AccessTokenClaims {
  jti: string;
  sub: string;
  azp: string;
  client_id: string;
  roles?: string[];
  scope: string;
}
