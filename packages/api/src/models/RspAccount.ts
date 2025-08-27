import { RelationMappingsThunk } from 'objection';
import { RspPosition, RspRole } from '@two/shared';
import { BaseModel } from './BaseModel';
import { Rsp } from './Rsp';
import { RspAccountSerializer } from './serializers';

export class RspAccount extends BaseModel {
  static tableName = 'rsp_accounts';
  static Serializer = RspAccountSerializer;

  readonly id!: string;

  position!: RspPosition;
  role?: RspRole;
  isProfileFilled!: boolean;

  userId!: string;
  rspId!: string;

  rsp?: Rsp;

  static relationMappings: RelationMappingsThunk = () => ({
    rsp: {
      relation: BaseModel.HasOneRelation,
      modelClass: Rsp,
      join: {
        from: 'rsp_accounts.rspId',
        to: 'rsp.id',
      },
    },
  });
}
