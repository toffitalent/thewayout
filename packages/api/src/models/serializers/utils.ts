import type { Context } from '@disruptive-labs/server';
import urlJoin from 'url-join';
import config from '@two/config';
import { VeteranOrJustice } from '@two/shared';
import type { Client } from '../Client';
import type { User } from '../User';

export interface Options {
  ctx?: Context;
}

export const isAdmin = (_: any, options: Options): boolean => !!options?.ctx?.auth.has('admin');
export const isRsp = (_: any, options: Options): boolean => !!options?.ctx?.auth.has('rsp');
export const isSelf = (user: Partial<User>, options: Options): boolean =>
  !!options?.ctx?.auth.is(user.id);

export const getImageProxyUrl = (value: string | null) =>
  !value || value.startsWith('https://')
    ? value
    : urlJoin(config.get('uploads.default.url', ''), value);

export const isClientVeteran = (client: Client): boolean =>
  client.veteranOrJustice.includes(VeteranOrJustice.veteran) || false;

export const isClientJusticeImpacted = (client: Client): boolean =>
  client.veteranOrJustice.includes(VeteranOrJustice.justiceImpacted) || false;
