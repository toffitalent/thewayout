import {
  Avatar,
  Badge,
  Box,
  Flex,
  Spinner,
  Text,
  ThemeColorScheme,
  Toggle,
} from '@disruptive-labs/ui';
import PencilIcon from '@disruptive-labs/ui/dist/icons/Pencil';
import { useRouter } from 'next/router';
import { ChangeEvent, useCallback, useEffect, useRef } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { JobApplicationListItem, JobApplicationStatus, JobStatus } from '@two/shared';
import { SEO } from '@app/components/SEO';
import { job as jobText } from '@app/data/jobText';
import { useAppDispatch, useAppSelector, useErrorIndicator, useIsDesktop } from '@app/hooks';
import { formatPhoneNumber, formatSalaryRange } from '@app/utils';
import { selectAuthUser } from '../../auth';
import { listApplications, retrieveJob, updateJob } from '../actions';
import { selectJob, selectJobApplicationsById, selectTotalJobApplications } from '../reducer';
import styles from './JobPage.module.scss';

const statusColor: { [key in JobApplicationStatus]: ThemeColorScheme } = {
  [JobApplicationStatus.applied]: 'blue',
  [JobApplicationStatus.interview]: 'grey',
  [JobApplicationStatus.hired]: 'green',
  [JobApplicationStatus.notAFit]: 'grey',
  [JobApplicationStatus.rejected]: 'grey',
  [JobApplicationStatus.expired]: 'grey',
};

export const ListItem = ({
  clientId,
  firstName,
  lastName,
  email,
  phone,
  status,
  avatar,
  onClick,
}: JobApplicationListItem & { onClick: (id: string) => void }) => {
  const isDesktop = useIsDesktop();

  return (
    <Flex
      direction="row"
      className={styles.listItemWrapper}
      onClick={() => onClick(clientId)}
      justify="space-between"
      alignItems="center"
      borderBottom
    >
      <Flex direction="row" width={isDesktop ? '1/4' : '3/4'} alignItems="center" pv={5}>
        <Avatar size="xs" name={`${firstName} ${lastName}`} src={avatar} />
        <Text fontWeight="700" ml={3}>{`${firstName} ${lastName}`}</Text>
      </Flex>
      {isDesktop && (
        <>
          <Text width="1/4">{email}</Text>
          <Text width="1/4">{formatPhoneNumber(phone || '')}</Text>
        </>
      )}
      <Flex width="1/4">
        <Badge colorScheme={statusColor[status]}>{jobText[status]}</Badge>
      </Flex>
    </Flex>
  );
};

export const JobPage = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const showError = useErrorIndicator();
  const { id } = router.query;
  const user = useAppSelector(selectAuthUser);
  const job = useAppSelector(selectJob);
  const total = useAppSelector((state) => selectTotalJobApplications(state, String(id)));
  const jobApplications = useAppSelector((state) => selectJobApplicationsById(state, String(id)));
  const isFetching = useRef(false);
  const isDesktop = useIsDesktop();

  useEffect(() => {
    if (id && user?.id) {
      dispatch(
        retrieveJob({ jobId: id as string, ...(job && job.id === id && { since: job.updatedAt }) }),
      )
        .unwrap()
        .catch((e) => showError(e))
        .then(() => {
          if (!jobApplications?.applications?.length && total !== 0 && user?.employer) {
            isFetching.current = true;
            dispatch(listApplications({ employerId: user.employer.id, jobId: id as string }))
              .unwrap()
              .then(() => {
                isFetching.current = false;
              });
          }
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onClick = useCallback(
    (clientId: string) => router.push(`/employer/jobs/${id}/applicant/${clientId}`),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const onUpdate = useCallback(
    () => router.push(`/employer/edit-job/${id}`),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const updateJobStatus = (jobStatus: JobStatus) => {
    if (job) {
      dispatch(
        updateJob({
          jobId: id as string,
          patch: { status: jobStatus },
        }),
      );
    }
  };

  if (!job || !user?.employer) {
    return (
      <Box pv={36} textAlign="center">
        <Spinner data-testid="loading-spinner" />
      </Box>
    );
  }

  return (
    <>
      <SEO title={`${job.title}`} />
      <Flex direction="column" width="full">
        <Flex>
          <Flex container justify="space-between">
            <Flex direction="row" alignItems="center">
              <Text fontSize="3xl" fontWeight="700">
                {job.title}
              </Text>
              <PencilIcon
                color="primary"
                width={7}
                height={7}
                ml={2}
                onClick={onUpdate}
                cursor="pointer"
              />
            </Flex>
            <Flex direction="row" alignItems="center" className={styles.status}>
              <Text>Job status:</Text>
              <Text fontWeight="700" mr={4} ml={1}>
                {jobText[job.status]}
              </Text>
              <Toggle
                defaultChecked={job.status === JobStatus.active}
                alignItems="center"
                display="flex"
                onChange={(event: ChangeEvent<HTMLInputElement>) =>
                  updateJobStatus(event.target.checked ? JobStatus.active : JobStatus.paused)
                }
              />
            </Flex>
          </Flex>

          <Flex item justify="space-between">
            <Flex display="flex" color="grey.600" mt={1} wrap="wrap">
              <Text>
                {`${jobText[job.typeOfWork]} (${jobText[job.workingTime]})`}&nbsp;&#x2022;&nbsp;
              </Text>
              <Text>
                {formatSalaryRange(
                  job.salaryOptions.min,
                  job.salaryOptions.max,
                  job.salaryOptions.salary,
                )}
                &nbsp;&#x2022;&nbsp;
              </Text>
              <Text>{`${job.applicationsCount || 0} Applicant${
                job.applicationsCount === 1 ? '' : 's'
              }`}</Text>
              <Text>
                &nbsp;
                {`(${job.hiredApplicationsCount || 0} of ${job.numberOfOpenPositions} position${
                  job.numberOfOpenPositions === 1 ? '' : 's'
                } filled)`}
              </Text>
            </Flex>
            <Text color="grey.600" mt={4}>
              {job.description}
            </Text>
          </Flex>
        </Flex>

        <Flex mt={8}>
          {!!(jobApplications && total && total !== 0) && (
            <>
              <Flex direction="row" width="full" fontWeight="700" pv={5} borderBottom>
                <Text width={isDesktop ? '1/4' : '3/4'}>Applicant Name</Text>
                {isDesktop && (
                  <>
                    <Text width="1/4">Email</Text>
                    <Text width="1/4">Phone</Text>
                  </>
                )}
                <Text width="1/4">Status</Text>
              </Flex>
              <InfiniteScroll
                dataLength={total}
                next={() => {
                  if (!isFetching.current) {
                    isFetching.current = true;
                    if (id && user?.employer) {
                      isFetching.current = true;
                      dispatch(
                        listApplications({ employerId: user.employer.id, jobId: id as string }),
                      )
                        .unwrap()
                        .then(() => {
                          isFetching.current = false;
                        });
                    }
                  }
                }}
                hasMore={total > jobApplications.applications.length}
                loader={
                  <Box key={0} display="flex" justifyContent="center" mt={14}>
                    <Spinner />
                  </Box>
                }
              >
                <Flex width="full" container>
                  {jobApplications.applications.map((application) => (
                    <Flex width="full" key={JSON.stringify(application)}>
                      <ListItem {...application} onClick={onClick} />
                    </Flex>
                  ))}
                </Flex>
              </InfiniteScroll>
            </>
          )}
        </Flex>
        {total === 0 && (
          <Flex
            display="flex"
            height="full"
            justifyContent="center"
            alignItems="center"
            direction="column"
          >
            <Text fontSize="3xl" fontWeight="700">
              Stay Tuned... 👋
            </Text>
            <Text mt={1}>
              Your job posting has no applicants yet. We will let you know as soon a someone
              applies.
            </Text>
          </Flex>
        )}
      </Flex>
    </>
  );
};
