import type { RelationMappingsThunk } from 'objection';
import { AuthGrantType } from '@two/shared';
import { App } from './App';
import { AppToken } from './AppToken';
import { BaseModel } from './BaseModel';

export class AppClient extends BaseModel {
  static tableName = 'app_clients';

  readonly id!: string;
  appId!: string;
  name!: string;
  secret!: string;
  grantType!: AuthGrantType;
  redirectUri!: string | null;

  app?: App;
  tokens?: AppToken[];

  static relationMappings: RelationMappingsThunk = () => ({
    app: {
      relation: BaseModel.BelongsToOneRelation,
      modelClass: App,
      join: {
        from: 'app_clients.appId',
        to: 'apps.id',
      },
    },

    tokens: {
      relation: BaseModel.HasManyRelation,
      modelClass: AppToken,
      join: {
        from: 'app_clients.id',
        to: 'app_tokens.clientId',
      },
    },
  });
}
