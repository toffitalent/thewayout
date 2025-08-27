import { Serializer } from '@disruptive-labs/objection-plugins';
import { getImageProxyUrl } from './utils';

export class RspAccountListItemSerializer extends Serializer {
  static attributes = [
    'id',
    'firstName',
    'lastName',
    'phone',
    'email',
    'avatar',
    'userId',
    'caseLoad',
  ];

  avatar = getImageProxyUrl;
}
