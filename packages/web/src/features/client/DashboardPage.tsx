import { Avatar, Badge, Box, ButtonLink, Flex, ReadMore, Spinner, Text } from '@disruptive-labs/ui';
import BriefcaseIcon from '@disruptive-labs/ui/dist/icons/Briefcase';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useRef } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { JobApplicationStatus, JobListItem, VeteranOrJustice } from '@two/shared';
import { SEO } from '@app/components/SEO';
import { useAppDispatch, useAppSelector } from '@app/hooks';
import { selectAuthUser } from '../auth';
import { listAppliedJobs, listSuggestedJobs, retrieveCaseManager } from './actions';
import styles from './DashboardPage.module.scss';
import { ListItem } from './ListItem';
import {
  selectAppliedJobs,
  selectCaseManager,
  selectForceReloadAppliedJobs,
  selectSuggestedJobs,
  selectTotalAppliedJobs,
} from './reducer';

export const MyJobListItem = ({
  id,
  title,
  department,
  applicationStatus,
  onClick,
}: JobListItem & { onClick: (id: string) => void }) => {
  const badgeColor =
    applicationStatus === (JobApplicationStatus.applied || JobApplicationStatus.interview)
      ? 'green'
      : 'grey';

  return (
    <Flex
      onClick={() => onClick(id)}
      direction="row"
      justify="space-between"
      alignItems="center"
      style={{ cursor: 'pointer' }}
    >
      <Flex direction="row" justify="space-between" alignItems="center">
        <Box bgcolor="orange.200" className={styles.icon} rounded mr={1}>
          <BriefcaseIcon height={6} width={6} color="orange.800" />
        </Box>
        <Box>
          <Text fontSize="lg" fontWeight="700">
            {title}
          </Text>
          <Text>{department}</Text>
        </Box>
      </Flex>
      <Badge maxHeight={5} colorScheme={badgeColor}>
        {applicationStatus}
      </Badge>
    </Flex>
  );
};

export function DashboardPage() {
  const router = useRouter();
  const user = useAppSelector(selectAuthUser);
  const dispatch = useAppDispatch();
  const isFetching = useRef(false);
  const jobs = useAppSelector(selectAppliedJobs);
  const suggestedJobs = useAppSelector(selectSuggestedJobs);
  const total = useAppSelector(selectTotalAppliedJobs);
  const forceReload = useAppSelector(selectForceReloadAppliedJobs);
  const clientRsp = useAppSelector(selectCaseManager);

  useEffect(() => {
    if (user?.id) {
      isFetching.current = true;
      dispatch(listAppliedJobs({ userId: user.id, ...(forceReload && { forceReload }) }))
        .unwrap()
        .then(() => {
          isFetching.current = false;
        });
    }
    if (user?.client) {
      dispatch(listSuggestedJobs(user.client?.id));
    }
    dispatch(retrieveCaseManager());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, user?.client, user?.id]);

  const onClick = useCallback(
    (id: string) => router.push(`/client/jobs/${id}/`),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  if (!user?.client) {
    return (
      <Box pv={20} textAlign="center">
        <Spinner color="primary" />
      </Box>
    );
  }

  return (
    <>
      <SEO title="Dashboard" />
      <Flex container direction="row-reverse">
        <Flex item xs={12} lg={4} className={styles.rightColumn}>
          <Box className={styles.profileInfo}>
            <Avatar size="2xl" name={`${user.firstName} ${user.lastName}`} src={user.avatar} />
            <Text
              fontSize="3xl"
              fontWeight="700"
              lineHeight="none"
              mt={5}
              mb={2}
            >{`${user.firstName} ${user.lastName}`}</Text>
            {user.client.veteranOrJustice.includes(VeteranOrJustice.veteran) && (
              <Badge bgcolor="grey.700" color="light" mb={2} ph={4}>
                US VETERAN 🇺🇸
              </Badge>
            )}
            {user.client.personalSummary && (
              <ReadMore buttonText="read more..." inline numberOfLines={2}>
                {user.client.personalSummary}
              </ReadMore>
            )}
          </Box>
          {clientRsp && (
            <Flex mt={5}>
              <Text fontSize="xl" fontWeight="700">
                Reentry Service Provider
              </Text>
              <Flex
                mt={4}
                direction="row"
                display="flex"
                alignItems="center"
                justify="space-between"
              >
                <Flex direction="row">
                  <Avatar
                    name={`${clientRsp.firstName} ${clientRsp.lastName}`}
                    src={clientRsp.avatar}
                  />
                  <Box ml={2}>
                    <Text fontSize="lg" fontWeight="700">
                      {clientRsp.firstName} {clientRsp.lastName}
                    </Text>
                    <Text>{clientRsp.rspName}</Text>
                  </Box>
                </Flex>
                <ButtonLink
                  variant="outline"
                  color="primary"
                  borderColor="primary"
                  fontSize="sm"
                  minHeight={8}
                  maxHeight={8}
                  pl={3}
                  pr={3}
                  href={`mailto:${clientRsp.email}`}
                >
                  Contact
                </ButtonLink>
              </Flex>
            </Flex>
          )}
          <Box mv={5}>
            <Text fontSize="xl" fontWeight="700" mb={5}>
              Jobs Applied
            </Text>
            <InfiniteScroll
              dataLength={jobs.length}
              next={() => {
                if (!isFetching.current) {
                  isFetching.current = true;
                  if (user?.id) {
                    dispatch(listAppliedJobs({ userId: user.id })).then(() => {
                      isFetching.current = false;
                    });
                  }
                }
              }}
              hasMore={total > jobs.length}
              loader={
                <Box key={0} display="flex" justifyContent="center" mt={14}>
                  <Spinner data-testid="loading-spinner" />
                </Box>
              }
            >
              <Flex width="full" container spacing={5}>
                {jobs.map((job) => (
                  <Flex item width="full" key={JSON.stringify(job)}>
                    <MyJobListItem {...job} onClick={onClick} />
                  </Flex>
                ))}
              </Flex>
            </InfiniteScroll>
          </Box>
        </Flex>
        <Flex direction="column" alignItems="flex-start" item xs={12} lg={8}>
          <Text fontSize="xl" fontWeight="700">
            Suggested Jobs
          </Text>
          {suggestedJobs.map((job) => (
            <Flex width="full" key={JSON.stringify(job)}>
              <ListItem {...job} onClick={onClick} />
            </Flex>
          ))}
        </Flex>
      </Flex>
    </>
  );
}
