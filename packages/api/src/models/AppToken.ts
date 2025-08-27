import type { RelationMappingsThunk } from 'objection';
import { App } from './App';
import { AppClient } from './AppClient';
import { BaseModel } from './BaseModel';
import { User } from './User';

export class AppToken extends BaseModel {
  static tableName = 'app_tokens';

  readonly id!: string;
  appId!: string;
  clientId!: string;
  userId!: string;
  token!: Buffer;
  self!: boolean;

  app?: App;
  client?: AppClient;
  user?: User;

  static relationMappings: RelationMappingsThunk = () => ({
    app: {
      relation: BaseModel.BelongsToOneRelation,
      modelClass: App,
      join: {
        from: 'app_tokens.appId',
        to: 'apps.id',
      },
    },

    client: {
      relation: BaseModel.BelongsToOneRelation,
      modelClass: AppClient,
      join: {
        from: 'app_tokens.clientId',
        to: 'app_clients.id',
      },
    },

    user: {
      relation: BaseModel.BelongsToOneRelation,
      modelClass: User,
      join: {
        from: 'app_tokens.userId',
        to: 'users.id',
      },
    },
  });
}
