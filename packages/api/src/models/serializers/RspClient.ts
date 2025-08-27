import { Serializer } from '@disruptive-labs/objection-plugins';

export class RspClientSerializer extends Serializer {
  static attributes = ['id', 'rspId', 'status', 'caseManagerId', 'notes'];

  static relations = ['user', 'caseManager'];
}
