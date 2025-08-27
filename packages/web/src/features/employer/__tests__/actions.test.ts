import {
  Industry,
  JobApplicationStatus,
  JobStatus,
  NumberOfEmployers,
  State,
  YearsInBusiness,
} from '@two/shared';
import { API } from '@app/api';
import { createState, fixtures } from '@test';
import {
  createEmployer,
  createJob,
  getClient,
  hireClient,
  interviewClient,
  listApplications,
  rejectClient,
  retrieveJob,
  updateJob,
} from '../actions';

jest.mock('@app/api');

describe('Employer > Actions', () => {
  const changeApplicationRequest = {
    employerId: 'TEST_EMPLOYER_ID',
    jobId: fixtures.job.id,
    applicationId: 'TEST_APPLICATION_ID',
  };

  test('createEmployer calls employer create API method', async () => {
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
    const action = createEmployer(data);
    await action(jest.fn(), jest.fn(), undefined);
    expect(API.employer.create).toBeCalled();
  });

  test('createJob calls job create API method', async () => {
    const action = createJob(fixtures.job);
    await action(jest.fn(), jest.fn(), undefined);
    expect(API.job.create).toBeCalled();
  });

  test('retrieveJob calls job retrieve API method', async () => {
    const action = retrieveJob({ jobId: fixtures.job.id });
    await action(jest.fn(), jest.fn(), undefined);
    expect(API.job.retrieve).toBeCalled();
  });

  test('listApplications calls employer listApplications API method', async () => {
    const action = listApplications({ employerId: 'TEST_EMPLOYER_ID', jobId: fixtures.job.id });
    await action(
      jest.fn(),
      jest.fn().mockReturnValue(
        createState({
          'employerJobs.jobsApplications.ids': ['1'],
          'employerJobs.jobsApplications.entities': { '1': { id: '1' } },
        }),
      ),
      undefined,
    );
    expect(API.employer.listApplications).toBeCalled();
  });

  test('getClient calls employer getClient API method', async () => {
    const action = getClient({
      employerId: 'TEST_EMPLOYER_ID',
      jobId: fixtures.job.id,
      clientId: fixtures.client.id,
    });
    await action(jest.fn(), jest.fn(), undefined);
    expect(API.employer.getClient).toBeCalled();
  });

  test('updateJob calls job update API method', async () => {
    const action = updateJob({ jobId: fixtures.job.id, patch: { status: JobStatus.paused } });
    await action(jest.fn(), jest.fn(), undefined);
    expect(API.job.update).toBeCalled();
  });

  test('interviewClient calls employer changeApplicationStatus API method', async () => {
    const action = interviewClient(changeApplicationRequest);
    await action(jest.fn(), jest.fn(), undefined);
    expect(API.employer.changeApplicationStatus).toBeCalledWith(
      ...Object.values(changeApplicationRequest),
      JobApplicationStatus.interview,
    );
  });

  test('hireClient calls employer changeApplicationStatus API method', async () => {
    const action = hireClient(changeApplicationRequest);
    await action(jest.fn(), jest.fn(), undefined);
    expect(API.employer.changeApplicationStatus).toBeCalledWith(
      ...Object.values(changeApplicationRequest),
      JobApplicationStatus.hired,
    );
  });

  test('rejectClient calls employer changeApplicationStatus API method', async () => {
    const action = rejectClient(changeApplicationRequest);
    await action(jest.fn(), jest.fn(), undefined);
    expect(API.employer.changeApplicationStatus).toBeCalledWith(
      ...Object.values(changeApplicationRequest),
      JobApplicationStatus.rejected,
    );
  });
});
