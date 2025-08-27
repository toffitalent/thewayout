import { Serializer } from '@disruptive-labs/objection-plugins';
import {
  getCloakedData,
  getCloakedEmail,
  getFullyCloakedData,
  VeteranOrJustice,
} from '@two/shared';
import type { Client } from '../Client';

export class ClientCloakedSerializer extends Serializer {
  static attributes = [
    'id',
    'firstName',
    'lastName',
    'phone',
    'address',
    'city',
    'state',
    'postalCode',
    'personalStrengths',
    'experience',
    'languages',
    'relativeExperience',
    'personalSummary',
    'education',
    'license',
    'updatedAt',
    'email',
    'applicationStatus',
    'applicationId',
    'questions',
    'veteranOrJustice',
    'veteranService',
    'veteranRank',
    'veteranStartAt',
    'veteranEndAt',
    'veteranCampaigns',
    'veteranTypeDischarge',
    'veteranDd214',
    'veteranReservist',
  ];

  firstName(value: Client['firstName']): Client['firstName'] {
    return getCloakedData(value);
  }

  lastName(value: Client['lastName']): Client['lastName'] {
    return getCloakedData(value);
  }

  phone(value: Client['phone']): Client['phone'] | undefined {
    if (value) {
      return getFullyCloakedData();
    }
    return undefined;
  }

  address(): Client['address'] {
    return getFullyCloakedData();
  }

  city(): Client['city'] {
    return getFullyCloakedData();
  }

  state(): Client['state'] {
    return getFullyCloakedData();
  }

  postalCode(): Client['postalCode'] {
    return getFullyCloakedData();
  }

  relativeExperience(value: Client['relativeExperience']): Client['relativeExperience'] {
    return (value || [])
      .sort(
        (a, b) =>
          new Date(Number(b.startAtYear), Number(b.startAtMonth)).getTime() -
          new Date(Number(a.startAtYear), Number(a.startAtMonth)).getTime(),
      )
      .map((exp) => ({ ...exp, company: getFullyCloakedData() }));
  }

  email(_: any, client: Client & { email: string }): string | undefined {
    if (client.email) {
      return getCloakedEmail(client.email);
    }
    return undefined;
  }

  education(value: Client['education']): Client['education'] {
    return (value || []).sort((a, b) => Number(b.startYear) - Number(a.startYear));
  }

  veteranService(
    value: Client['veteranService'],
    client: Client,
  ): Client['veteranService'] | undefined {
    if (client.veteranOrJustice.includes(VeteranOrJustice.veteran)) {
      return value;
    }

    return undefined;
  }

  veteranRank(value: Client['veteranRank'], client: Client): Client['veteranRank'] | undefined {
    if (client.veteranOrJustice.includes(VeteranOrJustice.veteran)) {
      return value;
    }

    return undefined;
  }

  veteranStartAt(
    value: Client['veteranStartAt'],
    client: Client,
  ): Client['veteranStartAt'] | undefined {
    if (client.veteranOrJustice.includes(VeteranOrJustice.veteran)) {
      return value;
    }

    return undefined;
  }

  veteranEndAt(value: Client['veteranEndAt'], client: Client): Client['veteranEndAt'] | undefined {
    if (client.veteranOrJustice.includes(VeteranOrJustice.veteran)) {
      return value;
    }

    return undefined;
  }

  veteranCampaigns(
    value: Client['veteranCampaigns'],
    client: Client,
  ): Client['veteranCampaigns'] | undefined {
    if (client.veteranOrJustice.includes(VeteranOrJustice.veteran)) {
      return value;
    }

    return undefined;
  }

  veteranTypeDischarge(
    value: Client['veteranTypeDischarge'],
    client: Client,
  ): Client['veteranTypeDischarge'] | undefined {
    if (client.veteranOrJustice.includes(VeteranOrJustice.veteran)) {
      return value;
    }

    return undefined;
  }

  veteranDd214(value: Client['veteranDd214'], client: Client): Client['veteranDd214'] | undefined {
    if (client.veteranOrJustice.includes(VeteranOrJustice.veteran)) {
      return value;
    }

    return undefined;
  }

  veteranReservist(
    value: Client['veteranReservist'],
    client: Client,
  ): Client['veteranReservist'] | undefined {
    if (client.veteranOrJustice.includes(VeteranOrJustice.veteran)) {
      return value;
    }

    return undefined;
  }
}
