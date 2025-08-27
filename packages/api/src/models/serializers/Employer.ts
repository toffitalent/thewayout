import { Serializer } from '@disruptive-labs/objection-plugins';
import { getImageProxyUrl } from './utils';

export class EmployerSerializer extends Serializer {
  static attributes = [
    'id',
    'name',
    'industry',
    'description',
    'yearsInBusiness',
    'numberOfEmployees',
    'address',
    'city',
    'state',
    'postalCode',
    'createdAt',
    'updatedAt',
    'availableJobsCount',
    'availableProfilesUncloak',
    'avatar',
  ];

  avatar = getImageProxyUrl;
}
