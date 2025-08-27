import { Serializer } from '@disruptive-labs/objection-plugins';
import {
  getCloakedData,
  getCloakedEmail,
  getFullyCloakedData,
  JobApplicationListItem,
  JobApplicationStatus,
} from '@two/shared';
import { getImageProxyUrl } from './utils';

export class JobApplicationListItemSerializer extends Serializer {
  static attributes = [
    'id',
    'jobId',
    'clientId',
    'status',
    'firstName',
    'lastName',
    'phone',
    'email',
    'avatar',
  ];

  firstName(value: JobApplicationListItem['firstName'], client: JobApplicationListItem) {
    return client.status === JobApplicationStatus.interview ||
      client.status === JobApplicationStatus.hired
      ? value
      : getCloakedData(value);
  }

  lastName(value: JobApplicationListItem['lastName'], client: JobApplicationListItem) {
    return client.status === JobApplicationStatus.interview ||
      client.status === JobApplicationStatus.hired
      ? value
      : getCloakedData(value);
  }

  phone(value: JobApplicationListItem['phone'], client: JobApplicationListItem) {
    if (value) {
      return client.status === JobApplicationStatus.interview ||
        client.status === JobApplicationStatus.hired
        ? value
        : getFullyCloakedData();
    }
    return undefined;
  }

  email(value: JobApplicationListItem['email'], client: JobApplicationListItem) {
    return client.status === JobApplicationStatus.interview ||
      client.status === JobApplicationStatus.hired
      ? value
      : getCloakedEmail(value);
  }

  avatar(value: JobApplicationListItem['avatar'], client: JobApplicationListItem) {
    return (client.status === JobApplicationStatus.interview ||
      client.status === JobApplicationStatus.hired) &&
      value
      ? getImageProxyUrl(value)
      : undefined;
  }
}
