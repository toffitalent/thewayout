import { Serializer } from '@disruptive-labs/objection-plugins';
import { UserRspClientListSerializer } from './UserRspClientList';
import { Options } from './utils';

export class RspClientListItemSerializer extends Serializer {
  static attributes = [
    'id',
    'rspId',
    'status',
    'caseManagerId',
    'caseManagerFirstName',
    'caseManagerLastName',
  ];

  static relations = ['user'];

  user(
    user: RspClientListItemSerializer['client'],
    _: RspClientListItemSerializer,
    options: Options,
  ) {
    if (user) {
      return new UserRspClientListSerializer().serialize(user, options);
    }

    return undefined;
  }
}
