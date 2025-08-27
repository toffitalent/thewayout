import { JobApplicationStatus } from '@two/shared';
import { JobApplicationListItemSerializer } from '../JobApplicationsListItem';

const mock = {
  id: 'TEST_ID',
  jobId: 'JOB_ID',
  clientId: 'CLIENT_ID',
  firstName: 'Firstname',
  lastName: 'Lastname',
  phone: '3345556666',
  email: 'test@email.com',
};

const cloakedStatuses = [
  JobApplicationStatus.applied,
  JobApplicationStatus.rejected,
  JobApplicationStatus.expired,
  JobApplicationStatus.notAFit,
];

const uncloakedStatuses = [JobApplicationStatus.hired, JobApplicationStatus.interview];

describe('JobApplicationListItemSerializer', () => {
  cloakedStatuses.forEach((status) => {
    test(`displays cloaked data for client with ${status} status`, async () => {
      const serializer = new JobApplicationListItemSerializer();

      const serialized = await serializer.serialize({ ...mock, status } as any);

      expect(serialized).toMatchSnapshot({ id: expect.any(String) });
    });
  });

  uncloakedStatuses.forEach((status) => {
    test(`displays uncloaked data for client with ${status} status`, async () => {
      const serializer = new JobApplicationListItemSerializer();

      const serialized = await serializer.serialize({ ...mock, status } as any);

      expect(serialized).toMatchSnapshot({ id: expect.any(String) });
    });
  });
});
