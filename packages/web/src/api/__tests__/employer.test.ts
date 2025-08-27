import {
  Industry,
  JobApplicationStatus,
  NumberOfEmployers,
  State,
  YearsInBusiness,
} from '@two/shared';
import { client } from '../client';
import { employer } from '../employer';

jest.mock('../client');

describe('API > Employer', () => {
  const data = {
    name: 'ABC',
    industry: Industry.accounting,
    description: 'Test descriptions',
    yearsInBusiness: YearsInBusiness['0-3'],
    numberOfEmployees: NumberOfEmployers['1-50'],
    address: 'Test',
    city: 'Los Angeles',
    state: State.CA,
    postalCode: '90255',
  };

  test('executes employer create request', async () => {
    (client.post as jest.Mock).mockImplementationOnce(() => Promise.resolve({ data }));
    const res = await employer.create(data);
    expect(res).toBe(data);
  });

  test('executes list application request', async () => {
    const list = [
      { id: '1', jobId: 'TEST_JOB_ID' },
      { id: '2', jobId: 'TEST_JOB_ID' },
    ];
    (client.get as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        data: list,
        headers: { 'x-total-count': '2' },
      }),
    );
    const res = await employer.listApplications('TEST_EMPLOYER_ID', 'TEST_JOB_ID', {});
    expect(res).toEqual({ data: list, total: 2 });
  });

  test('executes get client information request', async () => {
    (client.get as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({ data: { id: 'TEST_CLIENT_ID' } }),
    );
    const res = await employer.getClient('TEST_EMPLOYER_ID', 'TEST_JOB_ID', 'TEST_CLIENT_ID', {});
    expect(res).toEqual({ id: 'TEST_CLIENT_ID' });
  });

  test('executes change application status request', async () => {
    (client.patch as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({ data: { id: 'TEST_APPLICATION_ID' } }),
    );
    const res = await employer.changeApplicationStatus(
      'TEST_EMPLOYER_ID',
      'TEST_JOB_ID',
      'TEST_APPLICATION_ID',
      JobApplicationStatus.interview,
    );
    expect(res).toEqual({ id: 'TEST_APPLICATION_ID' });
  });
});
