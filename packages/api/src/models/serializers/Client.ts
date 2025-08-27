import { Serializer } from '@disruptive-labs/objection-plugins';
import type { Client } from '../Client';
import {
  getImageProxyUrl,
  isAdmin,
  isClientJusticeImpacted,
  isClientVeteran,
  isRsp,
  isSelf,
  Options,
} from './utils';

export class ClientSerializer extends Serializer {
  static attributes = [
    'id',
    'userId',
    'firstName',
    'lastName',
    'justiceStatus',
    'phone',
    'address',
    'city',
    'state',
    'postalCode',
    'support',
    'gender',
    'orientation',
    'religion',
    'maritalStatus',
    'age',
    'disability',
    'ethnicity',
    'veteranStatus',
    'referredBy',
    'personalStrengths',
    'experience',
    'languages',
    'offense',
    'sexualOffenderRegistry',
    'sbn',
    'timeServed',
    'releasedAt',
    'stateOrFederal',
    'relativeExperience',
    'personalSummary',
    'education',
    'license',
    'updatedAt',
    'email',
    'applicationStatus',
    'applicationId',
    'questions',
    'facility',
    'expectedReleasedAt',
    'releasedCounty',
    'avatar',
    'veteranOrJustice',
    'veteranService',
    'veteranRank',
    'veteranStartAt',
    'veteranEndAt',
    'veteranReservist',
    'veteranCampaigns',
    'veteranTypeDischarge',
    'veteranDd214',
  ];

  justiceStatus(
    value: Client['justiceStatus'],
    client: Client,
  ): Client['justiceStatus'] | undefined {
    if (isClientJusticeImpacted(client)) {
      return value;
    }

    return undefined;
  }

  offense(
    value: Client['offense'],
    client: Client,
    options: Options,
  ): Client['offense'] | undefined {
    if (
      (isSelf({ id: client.userId }, options) ||
        isAdmin(client.userId, options) ||
        isRsp(client.userId, options)) &&
      isClientJusticeImpacted(client)
    ) {
      return value;
    }

    return undefined;
  }

  sexualOffenderRegistry(
    value: Client['sexualOffenderRegistry'],
    client: Client,
    options: Options,
  ): Client['sexualOffenderRegistry'] | undefined {
    if (
      (isSelf({ id: client.userId }, options) || isAdmin(client.userId, options)) &&
      isClientJusticeImpacted(client)
    ) {
      return value;
    }

    return undefined;
  }

  sbn(value: Client['sbn'], client: Client, options: Options): Client['sbn'] | undefined {
    if (
      (isSelf({ id: client.userId }, options) || isAdmin(client.userId, options)) &&
      isClientJusticeImpacted(client)
    ) {
      return value;
    }

    return undefined;
  }

  timeServed(
    value: Client['timeServed'],
    client: Client,
    options: Options,
  ): Client['timeServed'] | undefined {
    if (
      (isSelf({ id: client.userId }, options) ||
        isAdmin(client.userId, options) ||
        isRsp(client.userId, options)) &&
      isClientJusticeImpacted(client)
    ) {
      return value;
    }

    return undefined;
  }

  releasedAt(
    value: Client['releasedAt'],
    client: Client,
    options: Options,
  ): Client['releasedAt'] | undefined {
    if (
      (isSelf({ id: client.userId }, options) ||
        isAdmin(client.userId, options) ||
        isRsp(client.userId, options)) &&
      isClientJusticeImpacted(client)
    ) {
      return value;
    }

    return undefined;
  }

  stateOrFederal(
    value: Client['stateOrFederal'],
    client: Client,
    options: Options,
  ): Client['stateOrFederal'] | undefined {
    if (
      (isSelf({ id: client.userId }, options) ||
        isAdmin(client.userId, options) ||
        isRsp(client.userId, options)) &&
      isClientJusticeImpacted(client)
    ) {
      return value;
    }

    return undefined;
  }

  facility(
    value: Client['facility'],
    client: Client,
    options: Options,
  ): Client['facility'] | undefined {
    if (
      (isSelf({ id: client.userId }, options) || isAdmin(client.userId, options)) &&
      isClientJusticeImpacted(client)
    ) {
      return value;
    }

    return undefined;
  }

  expectedReleasedAt(
    value: Client['expectedReleasedAt'],
    client: Client,
    options: Options,
  ): Client['expectedReleasedAt'] | undefined {
    if (
      (isSelf({ id: client.userId }, options) || isAdmin(client.userId, options)) &&
      isClientJusticeImpacted(client)
    ) {
      return value;
    }

    return undefined;
  }

  releasedCounty(
    value: Client['releasedCounty'],
    client: Client,
    options: Options,
  ): Client['releasedCounty'] | undefined {
    if (
      (isSelf({ id: client.userId }, options) || isAdmin(client.userId, options)) &&
      isClientJusticeImpacted(client)
    ) {
      return value;
    }

    return undefined;
  }

  relativeExperience(value: Client['relativeExperience']): Client['relativeExperience'] {
    return (value || []).sort(
      (a, b) =>
        new Date(Number(b.startAtYear), Number(b.startAtMonth)).getTime() -
        new Date(Number(a.startAtYear), Number(a.startAtMonth)).getTime(),
    );
  }

  education(value: Client['education']): Client['education'] {
    return (value || []).sort((a, b) => Number(b.startYear) - Number(a.startYear));
  }

  avatar(_: any, client: Client & { avatar: string }): string | null | undefined {
    if (client.avatar) {
      return getImageProxyUrl(client.avatar);
    }
    return undefined;
  }

  veteranService(
    value: Client['veteranService'],
    client: Client,
  ): Client['veteranService'] | undefined {
    if (isClientVeteran(client)) {
      return value;
    }

    return undefined;
  }

  veteranRank(value: Client['veteranRank'], client: Client): Client['veteranRank'] | undefined {
    if (isClientVeteran(client)) {
      return value;
    }

    return undefined;
  }

  veteranStartAt(
    value: Client['veteranStartAt'],
    client: Client,
  ): Client['veteranStartAt'] | undefined {
    if (isClientVeteran(client)) {
      return value;
    }

    return undefined;
  }

  veteranEndAt(value: Client['veteranEndAt'], client: Client): Client['veteranEndAt'] | undefined {
    if (isClientVeteran(client)) {
      return value;
    }

    return undefined;
  }

  veteranReservist(
    value: Client['veteranReservist'],
    client: Client,
  ): Client['veteranReservist'] | undefined {
    if (isClientVeteran(client)) {
      return value;
    }

    return undefined;
  }

  veteranCampaigns(
    value: Client['veteranCampaigns'],
    client: Client,
  ): Client['veteranCampaigns'] | undefined {
    if (isClientVeteran(client)) {
      return value;
    }

    return undefined;
  }

  veteranTypeDischarge(
    value: Client['veteranTypeDischarge'],
    client: Client,
  ): Client['veteranTypeDischarge'] | undefined {
    if (isClientVeteran(client)) {
      return value;
    }

    return undefined;
  }

  veteranDd214(value: Client['veteranDd214'], client: Client): Client['veteranDd214'] | undefined {
    if (isClientVeteran(client)) {
      return value;
    }

    return undefined;
  }
}
