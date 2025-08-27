import { Serializer } from '@disruptive-labs/objection-plugins';
import { getImageProxyUrl } from './utils';

export class RspAccountSerializer extends Serializer {
  static attributes = [
    'id',
    'firstName',
    'lastName',
    'phone',
    'role',
    'isProfileFilled',
    'avatar',
    'email',
    'rspId',
    'userId',
  ];

  static relations = ['rsp'];

  avatar = getImageProxyUrl;
}
