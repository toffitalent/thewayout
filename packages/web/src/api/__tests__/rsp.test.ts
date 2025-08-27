import { RspClientStatus, RspPosition, StatCategory } from '@two/shared';
import { fixtures } from '@test';
import { client } from '../client';
import { rsp } from '../rsp';

jest.mock('../client');

describe('API > Rsp', () => {
  test('executes create rsp request', async () => {
    const ownerRequest = { phone: '', position: RspPosition.caseManager };
    const requestData = { rsp: fixtures.rsp, owner: ownerRequest };

    (client.post as jest.Mock).mockImplementationOnce(() => Promise.resolve({ data: requestData }));

    const res = await rsp.create({
      ...fixtures.rsp,
      owner: ownerRequest,
    });
    expect(res).toBe(requestData);
  });

  test('executes update rsp request', async () => {
    (client.patch as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({ data: fixtures.rsp }),
    );

    const res = await rsp.update({ id: fixtures.rsp.id, name: 'Test' });
    expect(res).toBe(fixtures.rsp);
  });

  test('executes create member request', async () => {
    (client.put as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({ data: fixtures.rspAccountMember }),
    );

    const res = await rsp.createMember({
      ...fixtures.rspAccountMember,
    });
    expect(res).toBe(fixtures.rspAccountMember);
  });

  test('executes list case managers request', async () => {
    (client.get as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({ data: [fixtures.rspAccountMember], headers: { 'x-total-count': '2' } }),
    );

    const res = await rsp.listCaseManagers(fixtures.rsp.id, {});
    expect(res).toEqual({ data: [fixtures.rspAccountMember], total: 2 });
  });

  test('executes invite case manager request', async () => {
    (client.post as jest.Mock).mockImplementationOnce(() => Promise.resolve({}));

    const res = await rsp.inviteCaseManager(fixtures.rspAccountMember);
    expect(res).toBe(undefined);
  });

  test('executes list invited case manager request', async () => {
    (client.get as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({ data: [fixtures.invitation], headers: { 'x-total-count': '1' } }),
    );

    const res = await rsp.listInvitations(fixtures.rsp.id, {});
    expect(res).toEqual({ data: [fixtures.invitation], total: 1 });
  });

  test('executes remove invitation request', async () => {
    (client.delete as jest.Mock).mockImplementationOnce(() => Promise.resolve({}));

    const res = await rsp.removeInvitation({
      rspId: fixtures.rsp.id,
      invitationId: fixtures.invitation.id,
    });
    expect(res).toBe(undefined);
  });

  test('executes retrieve account request', async () => {
    (client.get as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({ data: fixtures.rspAccountMember }),
    );

    const res = await rsp.retrieveAccount({
      rspId: fixtures.rsp.id,
      userId: fixtures.rspAccountMember.userId,
    });
    expect(res).toBe(fixtures.rspAccountMember);
  });

  test('executes update case manager request', async () => {
    (client.patch as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({ data: fixtures.rspAccountMember }),
    );

    const res = await rsp.updateCaseManager({
      rspId: fixtures.rsp.id,
      userId: fixtures.rspAccountMember.userId,
      firstName: 'Test',
    });
    expect(res).toBe(fixtures.rspAccountMember);
  });

  test('executes remove case manager request', async () => {
    (client.delete as jest.Mock).mockImplementationOnce(() => Promise.resolve({}));

    const res = await rsp.removeCaseManager({
      rspId: fixtures.rsp.id,
      userId: fixtures.rspAccountMember.userId,
    });
    expect(res).toBe(undefined);
  });

  test('executes list clients request', async () => {
    (client.get as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({ data: [fixtures.rspClient], headers: { 'x-total-count': '1' } }),
    );

    const res = await rsp.listClients(fixtures.rsp.id, {});
    expect(res).toStrictEqual({ data: [fixtures.rspClient], total: 1 });
  });

  test('executes retrieve client request', async () => {
    (client.get as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({ data: fixtures.rspClient }),
    );

    const res = await rsp.retrieveClient({
      rspId: fixtures.rsp.id,
      clientId: fixtures.rspClient.id,
    });
    expect(res).toBe(fixtures.rspClient);
  });

  test('executes change client status request', async () => {
    (client.patch as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({ data: fixtures.rspClient }),
    );

    const res = await rsp.changeClientStatus(
      fixtures.rsp.id,
      fixtures.rspClient.id,
      RspClientStatus.closed,
    );
    expect(res).toBe(fixtures.rspClient);
  });

  test('executes assign case manager request', async () => {
    (client.patch as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({ data: fixtures.rspClient }),
    );

    const res = await rsp.assignCaseManager(
      fixtures.rsp.id,
      fixtures.rspClient.id,
      fixtures.rspAccountOwner.id,
    );
    expect(res).toBe(fixtures.rspClient);
  });

  test('executes get statistics request', async () => {
    (client.get as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({ data: fixtures.statistics }),
    );

    const res = await rsp.getStatistics({
      rspId: fixtures.rsp.id,
      category: StatCategory.services,
    });
    expect(res).toBe(fixtures.statistics);
  });
});
