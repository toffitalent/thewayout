import type { RelationMappingsThunk } from 'objection';
import { App } from './App';
import { BaseModel } from './BaseModel';
import { AppUserSerializer } from './serializers';
import { User } from './User';

export class AppUser extends BaseModel {
  static tableName = 'app_users';
  static Serializer = AppUserSerializer;

  readonly id!: string;
  appId!: string;
  userId!: string;
  scope!: string[];

  app?: App;
  user?: User;

  static relationMappings: RelationMappingsThunk = () => ({
    app: {
      relation: BaseModel.BelongsToOneRelation,
      modelClass: App,
      join: {
        from: 'app_users.appId',
        to: 'apps.id',
      },
    },

    user: {
      relation: BaseModel.BelongsToOneRelation,
      modelClass: User,
      join: {
        from: 'app_users.userId',
        to: 'users.id',
      },
    },
  });
}
