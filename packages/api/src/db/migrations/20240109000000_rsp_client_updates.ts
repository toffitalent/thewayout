import { Knex } from 'knex';
import config from '@two/config';
import { RspClientStatus } from '@two/shared';

interface Client {
  user_id: string;
  reentry_service_provider: string;
  reentry_pipeline: string;
}

const rspIds: { [key: string]: string | undefined } = {
  employMilwaukee: config.get('rsp.employMilwaukee'),
  myWayOut: config.get('rsp.myWayOut'),
  wowWorks: config.get('rsp.wowWorks'),
};

const rspToMigrate: string[] = [];
Object.entries(rspIds).forEach(([key, value]) => {
  if (value) {
    rspToMigrate.push(key);
  }
});

export async function up(knex: Knex) {
  const clientsWithRsp = await knex('clients')
    .where('reentry_service_provider', 'in', rspToMigrate)
    .orWhere('reentry_pipeline', 'in', rspToMigrate)
    .select('clients.user_id', 'clients.reentry_service_provider', 'clients.reentry_pipeline');

  const updatedClientsWithRsp = clientsWithRsp.map((client: Client) => ({
    user_id: client.user_id,
    rsp_id: rspIds[client.reentry_service_provider] || rspIds[client.reentry_pipeline],
    status: RspClientStatus.pending,
  }));

  if (updatedClientsWithRsp.length) {
    await knex('rsp_clients').insert(updatedClientsWithRsp);
  }
}

export async function down(knex: Knex) {
  const clientsWithRsp = await knex('clients')
    .where('reentry_service_provider', 'in', rspToMigrate)
    .orWhere('reentry_pipeline', 'in', rspToMigrate)
    .select('clients.user_id');

  const ids = clientsWithRsp.map((client: Client) => client.user_id);

  await knex('rsp_clients').where('user_id', 'in', ids).del();
}
