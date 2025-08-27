import { Serializer } from '@disruptive-labs/objection-plugins';

export class ClientCaseManagerSerializer extends Serializer {
  static attributes = ['firstName', 'lastName', 'avatar', 'email', 'rspName'];
}
