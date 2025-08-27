import type { RelationMappingsThunk } from 'objection';
import { AppClient } from './AppClient';
import { AppToken } from './AppToken';
import { AppUser } from './AppUser';
import { BaseModel } from './BaseModel';
import { AppSerializer } from './serializers';

export class App extends BaseModel {
  static tableName = 'apps';
  static Serializer = AppSerializer;

  readonly id!: string;
  name!: string;
  userId!: string | null;

  clients?: AppClient[];
  tokens?: AppToken[];
  users?: AppUser[];

  static relationMappings: RelationMappingsThunk = () => ({
    clients: {
      relation: BaseModel.HasManyRelation,
      modelClass: AppClient,
      join: {
        from: 'apps.id',
        to: 'app_clients.appId',
      },
    },

    tokens: {
      relation: BaseModel.HasManyRelation,
      modelClass: AppToken,
      join: {
        from: 'apps.id',
        to: 'app_tokens.appId',
      },
    },

    users: {
      relation: BaseModel.HasManyRelation,
      modelClass: AppUser,
      join: {
        from: 'apps.id',
        to: 'app_users.appId',
      },
    },
  });
}
