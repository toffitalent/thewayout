import { Serializer } from '@disruptive-labs/objection-plugins';

export class RspAccountListSerializer extends Serializer {
  static attributes = ['id', 'firstName', 'lastName'];
}
