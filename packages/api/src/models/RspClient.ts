import { Knex } from 'knex';
import { QueryContext, RelationMappingsThunk } from 'objection';
import * as Mail from '@two/mail';
import { offenseText, RspClientStatus, RspRole, supportText } from '@two/shared';
import { BaseModel } from './BaseModel';
import { Client } from './Client';
import { Rsp } from './Rsp';
import { RspAccount } from './RspAccount';
import { RspClientSerializer } from './serializers';
import { User } from './User';

export class RspClient extends BaseModel {
  static tableName = 'rsp_clients';
  static Serializer = RspClientSerializer;

  readonly id!: string;

  userId!: string;
  rspId!: string;
  caseManagerId?: string;
  status!: RspClientStatus;
  closedAt!: Date | null;
  notes?: string;

  caseManager?: RspAccount;
  rsp?: Rsp;
  user?: User;

  static relationMappings: RelationMappingsThunk = () => ({
    caseManager: {
      relation: BaseModel.HasOneRelation,
      modelClass: RspAccount,
      join: {
        from: 'rsp_clients.caseManagerId',
        to: 'rsp_accounts.id',
      },
    },

    rsp: {
      relation: BaseModel.BelongsToOneRelation,
      modelClass: Rsp,
      join: {
        from: 'rsp_clients.rspId',
        to: 'rsp.id',
      },
    },

    user: {
      relation: BaseModel.HasOneRelation,
      modelClass: User,
      join: {
        from: 'rsp_clients.userId',
        to: 'users.id',
      },
    },
  });

  async $afterInsert(queryContext: QueryContext) {
    await super.$afterInsert(queryContext);

    const newClient = await Client.query().where({ userId: this.userId }).first();
    const chosenRsp = await Rsp.query().findById(this.rspId);
    const rspOwner = await RspAccount.query()
      .select(['rsp_accounts.*', 'users.email', 'users.firstName', 'users.lastName'])
      .leftJoin('users', (join: Knex.JoinClause) => {
        join.on('rsp_accounts.userId', 'users.id');
      })
      .where({ rspId: chosenRsp?.id })
      .where({ role: RspRole.owner })
      .first();

    if (newClient && chosenRsp && rspOwner) {
      const clientUser = await User.query().findById(newClient.userId);

      const {
        email,
        firstName: ownerFirstName,
        lastName: ownerLastName,
      } = rspOwner as RspAccount & {
        email: string;
        firstName: string;
        lastName: string;
      };
      const {
        firstName,
        lastName,
        address,
        postalCode,
        city,
        state,
        phone,
        support,
        offense,
        justiceStatus,
        facility,
        expectedReleasedAt,
      } = newClient;

      await Promise.all([
        Mail.send(
          {
            to: {
              address: email,
              name: `${ownerFirstName} ${ownerLastName}`,
            },
            cc: { address: 'support@twout.org', name: 'Support' },
          },
          'RspApplicationSupport',
          {
            user: {
              name: `${firstName} ${lastName}`,
              email: clientUser!.email,
              address: `${address}, ${city}, ${state} ${postalCode}`,
              phone: phone || '',
              support: support.map((el) => supportText[el]).join(', '),
              offense: offense?.map((el) => offenseText[el]).join(', ') || 'N/A',
              justiceStatus,
              facility,
              expectedReleasedAt,
            },
            rsp: {
              caseManagerFirstName: ownerFirstName,
              name: chosenRsp.name,
            },
          },
        ),
        Mail.send(
          { to: { address: clientUser!.email, name: clientUser!.name } },
          'RspApplication',
          {
            user: newClient,
            reentryServiceProvider: chosenRsp.name,
          },
        ),
      ]);
    }
  }
}
