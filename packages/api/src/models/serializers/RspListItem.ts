import { Serializer } from '@disruptive-labs/objection-plugins';

export class RspListItemSerializer extends Serializer {
  static attributes = ['id', 'name', 'description', 'servicesArea', 'support'];
}
