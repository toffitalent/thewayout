import { Serializer } from '@disruptive-labs/objection-plugins';

export class RspInvitationSerializer extends Serializer {
  static attributes = ['id', 'rspId', 'firstName', 'lastName', 'phone', 'email'];
}
