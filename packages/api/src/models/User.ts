import bcrypt from 'bcrypt';
import type { ModelOptions, QueryContext, RelationMappingsThunk } from 'objection';
import { App } from './App';
import { AppToken } from './AppToken';
import { AppUser } from './AppUser';
import { BaseModel } from './BaseModel';
import { Client } from './Client';
import { Employer } from './Employer';
import { RspAccount } from './RspAccount';
import { RspClient } from './RspClient';
import { UserSerializer } from './serializers';

const REGEXP = /^\$2[ayb]\$[0-9]{2}\$[A-Za-z0-9./]{53}$/;

function isBcryptHash(str: string): boolean {
  return REGEXP.test(str);
}

export class User extends BaseModel {
  static tableName = 'users';
  static Serializer = UserSerializer;

  readonly id!: string;
  firstName!: string;
  lastName!: string;
  email!: string;
  username!: string;
  password!: string;
  roles!: string[];
  phone?: string;
  avatar?: string;

  apps?: App[];
  authorizations?: AppUser[];
  tokens?: AppToken[];
  client?: Client;
  employer?: Employer;
  rspAccount?: RspAccount;
  rspClient?: RspClient;

  get name(): string {
    return `${this.firstName}${this.lastName ? ` ${this.lastName}` : ''}`;
  }

  async $beforeInsert(queryContext: QueryContext) {
    await super.$beforeInsert(queryContext);
    await this.hashPassword();
  }

  async $beforeUpdate(opt: ModelOptions, queryContext: QueryContext) {
    await super.$beforeUpdate(opt, queryContext);
    await this.hashPassword();
  }

  async hashPassword() {
    if (this.password) {
      if (isBcryptHash(this.password)) {
        throw new Error('Password property already contains Bcrypt hash');
      }

      this.password = await bcrypt.hash(this.password, 12);
    }
  }

  async verifyPassword(password: string) {
    if (!this.password) return false;

    return bcrypt.compare(password, this.password);
  }

  static relationMappings: RelationMappingsThunk = () => ({
    apps: {
      relation: BaseModel.HasManyRelation,
      modelClass: App,
      join: {
        from: 'users.id',
        to: 'apps.userId',
      },
    },

    authorizations: {
      relation: BaseModel.HasManyRelation,
      modelClass: AppUser,
      join: {
        from: 'users.id',
        to: 'app_users.userId',
      },
    },

    tokens: {
      relation: BaseModel.HasManyRelation,
      modelClass: AppToken,
      join: {
        from: 'users.id',
        to: 'app_tokens.userId',
      },
    },

    client: {
      relation: BaseModel.HasOneRelation,
      modelClass: Client,
      join: {
        from: 'users.id',
        to: 'clients.userId',
      },
    },

    employer: {
      relation: BaseModel.HasOneRelation,
      modelClass: Employer,
      join: {
        from: 'users.id',
        to: 'employers.userId',
      },
    },

    rspAccount: {
      relation: BaseModel.HasOneRelation,
      modelClass: RspAccount,
      join: {
        from: 'users.id',
        to: 'rsp_accounts.userId',
      },
    },

    rspClient: {
      relation: BaseModel.HasOneRelation,
      modelClass: RspClient,
      join: {
        from: 'users.id',
        to: 'rsp_clients.userId',
      },
    },
  });
}
