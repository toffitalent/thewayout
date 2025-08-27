import { createState, fixtures, makeGetState } from '@test';
import {
  listAllJobs,
  listAppliedJobs,
  listRsp,
  listSuggestedJobs,
  retrieveCaseManager,
  retrieveJob,
} from '../actions';
import {
  reducer,
  selectAllJobs,
  selectAllJobsList,
  selectAllRsp,
  selectAppliedJobs,
  selectCaseManager,
  selectJobById,
  selectJobEntities,
  selectJobIds,
  selectJobsListEntities,
  selectJobsListIds,
  selectSuggestedJobs,
  selectTotalAppliedJobs,
  selectTotalJobs,
} from '../reducer';

const getState = makeGetState('clientJobs');
const { job, user, rsp, clientCaseManager } = fixtures;

describe('Client > Reducer', () => {
  test('returns empty initial state', () => {
    expect(reducer(undefined, { type: '' })).toMatchSnapshot();
  });

  test('handles listAllJobs fulfilled actions', () => {
    expect(
      reducer(
        getState({ jobsList: { ids: [], entities: {} } }),
        listAllJobs.fulfilled({ data: [job], total: 1 }, '', {}),
      ),
    ).toMatchSnapshot();
  });

  test('handles retrieveJob fulfilled actions', () => {
    expect(
      reducer(
        getState({ jobs: { ids: [], entities: {} } }),
        retrieveJob.fulfilled(job, '', {
          jobId: job.id,
        }),
      ),
    ).toMatchSnapshot();
  });

  test('handles listAppliedJobs fulfilled actions', () => {
    expect(
      reducer(
        getState({ appliedJobs: { ids: [], entities: {} } }),
        listAppliedJobs.fulfilled({ data: [job], total: 1 }, '', { userId: user.id }),
      ),
    ).toMatchSnapshot();
  });

  test('handles listSuggestedJobs fulfilled actions', () => {
    expect(
      reducer(
        getState({ suggestedJobs: { ids: [], entities: {} } }),
        listSuggestedJobs.fulfilled([job], '', ''),
      ),
    ).toMatchSnapshot();
  });

  test('handles listRsp pending actions', () => {
    expect(
      reducer(getState(), listRsp.pending('', { support: rsp.support, userId: user.id })),
    ).toMatchSnapshot();
  });

  test('handles listRsp fulfilled actions', () => {
    expect(
      reducer(
        getState({ rspList: { ids: [], entities: {} } }),
        listRsp.fulfilled(
          {
            data: [
              {
                id: rsp.id,
                name: rsp.name,
                description: rsp.description,
                servicesArea: rsp.servicesArea,
                support: rsp.support,
              },
            ],
            total: 1,
          },
          '',
          { support: rsp.support, userId: user.id },
        ),
      ),
    ).toMatchSnapshot();
  });

  test('handles retrieveCaseManager fulfilled actions', () => {
    expect(
      reducer(
        getState({ caseManager: null }),
        retrieveCaseManager.fulfilled(clientCaseManager, ''),
      ),
    ).toMatchSnapshot();
  });
});

describe('Client > Selectors', () => {
  test('selectTotalJobs returns number of jobs', () => {
    expect(selectTotalJobs(createState())).toBe(1);
    expect(selectTotalJobs(createState({ 'clientJobs.jobsList.total': 0 }))).toBe(0);
  });

  test('selectTotalAppliedJobs returns number of applied jobs', () => {
    expect(selectTotalAppliedJobs(createState())).toBe(1);
    expect(selectTotalAppliedJobs(createState({ 'clientJobs.appliedJobs.total': 0 }))).toBe(0);
  });

  test('selectJobsListIds returns jobs ids', () => {
    expect(selectJobsListIds(createState())).toStrictEqual([job.id]);
    expect(
      selectJobsListIds(
        createState({
          'clientJobs.jobsList': {
            ids: [],
            entities: {},
          },
        }),
      ),
    ).toStrictEqual([]);
  });

  test('selectJobsListEntities returns jobs entities', () => {
    expect(selectJobsListEntities(createState())).toStrictEqual({ [job.id]: job });
    expect(
      selectJobsListEntities(
        createState({
          'clientJobs.jobsList': {
            ids: [],
            entities: {},
          },
        }),
      ),
    ).toStrictEqual({});
  });

  test('selectAllJobsList returns jobs list', () => {
    expect(selectAllJobsList(createState())).toStrictEqual([job]);
    expect(
      selectAllJobsList(
        createState({
          'clientJobs.jobsList': {
            ids: [],
            entities: {},
          },
        }),
      ),
    ).toStrictEqual([]);
  });

  test('selectJobIds returns jobs ids', () => {
    expect(selectJobIds(createState())).toStrictEqual([job.id]);
    expect(
      selectJobIds(
        createState({
          'clientJobs.jobs': {
            ids: [],
            entities: {},
          },
        }),
      ),
    ).toStrictEqual([]);
  });

  test('selectJobEntities returns jobs entities', () => {
    expect(selectJobEntities(createState())).toStrictEqual({ [job.id]: job });
    expect(
      selectJobEntities(
        createState({
          'clientJobs.jobs': {
            ids: [],
            entities: {},
          },
        }),
      ),
    ).toStrictEqual({});
  });

  test('selectAllJobs returns jobs list', () => {
    expect(selectAllJobs(createState())).toStrictEqual([job]);
    expect(
      selectAllJobs(
        createState({
          'clientJobs.jobs': {
            ids: [],
            entities: {},
          },
        }),
      ),
    ).toStrictEqual([]);
  });

  test('selectJobById returns job', () => {
    expect(selectJobById(createState(), job.id)).toBe(job);
    expect(
      selectJobById(
        createState({
          'clientJobs.jobs': {
            ids: [],
            entities: {},
          },
        }),
        job.id,
      ),
    ).toBe(undefined);
  });

  test('selectAppliedJobs returns jobs list', () => {
    expect(selectAppliedJobs(createState())).toStrictEqual([job]);
    expect(
      selectAppliedJobs(
        createState({
          'clientJobs.appliedJobs': {
            ids: [],
            entities: {},
          },
        }),
      ),
    ).toStrictEqual([]);
  });

  test('selectSuggestedJobs returns jobs list', () => {
    expect(selectSuggestedJobs(createState())).toStrictEqual([job]);
    expect(
      selectSuggestedJobs(
        createState({
          'clientJobs.suggestedJobs': {
            ids: [],
            entities: {},
          },
        }),
      ),
    ).toStrictEqual([]);
  });

  test('selectAllRsp returns jobs list', () => {
    expect(selectAllRsp(createState())).toStrictEqual([rsp]);
    expect(
      selectAllRsp(
        createState({
          'clientJobs.rspList': {
            ids: [],
            entities: {},
          },
        }),
      ),
    ).toStrictEqual([]);
  });

  test('selectCaseManager returns client case manager', () => {
    expect(selectCaseManager(createState())).toStrictEqual(clientCaseManager);
    expect(
      selectCaseManager(
        createState({
          'clientJobs.caseManager': null,
        }),
      ),
    ).toBe(null);
  });
});
