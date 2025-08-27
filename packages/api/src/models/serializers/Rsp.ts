import { Serializer } from '@disruptive-labs/objection-plugins';
import { VeteranOrJustice } from '@two/shared';
import type { Rsp } from '../Rsp';
import { getImageProxyUrl } from './utils';

export class RspSerializer extends Serializer {
  static attributes = [
    'id',
    'name',
    'description',
    'address',
    'city',
    'state',
    'postalCode',
    'phone',
    'email',
    'servicesArea',
    'support',
    'justiceStatus',
    'offenses',
    'avatar',
    'veteranOrJustice',
    'createdAt',
    'updatedAt',
  ];

  avatar = getImageProxyUrl;

  justiceStatus(value: Rsp['justiceStatus'], rsp: Rsp): Rsp['justiceStatus'] | undefined {
    if (rsp.veteranOrJustice.includes(VeteranOrJustice.justiceImpacted)) {
      return value;
    }

    return undefined;
  }

  offenses(value: Rsp['offenses'], rsp: Rsp): Rsp['offenses'] | undefined {
    if (rsp.veteranOrJustice.includes(VeteranOrJustice.justiceImpacted)) {
      return value;
    }

    return undefined;
  }
}
