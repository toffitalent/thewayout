import { Serializer } from '@disruptive-labs/objection-plugins';

export class AppUserSerializer extends Serializer {
  static attributes = ['id', 'appId', 'userId', 'scope', 'createdAt', 'updatedAt'];
  static relations = ['app', 'user'];
}
