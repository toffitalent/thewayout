import { RelationMappingsThunk } from 'objection';
import { BaseModel } from './BaseModel';
import { Rsp } from './Rsp';
import { RspInvitationSerializer } from './serializers';

export class RspInvitation extends BaseModel {
  static tableName = 'rsp_invitations';
  static Serializer = RspInvitationSerializer;

  readonly id!: string;

  rspId!: string;
  firstName!: string;
  lastName!: string;
  phone!: string;
  email!: string;

  rsp?: Rsp;

  static relationMappings: RelationMappingsThunk = () => ({
    rsp: {
      relation: BaseModel.HasOneRelation,
      modelClass: Rsp,
      join: {
        from: 'rsp_invitations.rspId',
        to: 'rsp.id',
      },
    },
  });
}
