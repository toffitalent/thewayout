import { Box, Container, Flex, Heading, Spinner } from '@disruptive-labs/ui';
import { useRouter } from 'next/router';
import { useEffect, useRef } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { selectAllJobsList, selectTotalJobs } from '@app/features/client';
import { listAllJobs } from '@app/features/client/actions';
import { useAppDispatch, useAppSelector } from '@app/hooks';
import styles from './JobsListPage.module.scss';
import { ListItem } from './ListItem';

export const JobsListPage = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const isFetching = useRef(false);

  const jobs = useAppSelector(selectAllJobsList);
  const total = useAppSelector(selectTotalJobs);

  useEffect(() => {
    isFetching.current = true;
    dispatch(listAllJobs({}))
      .unwrap()
      .then(() => {
        isFetching.current = false;
      });
  }, [dispatch]);

  const onClick = (id: string) => router.push(`/jobs/${id}/`);

  return (
    <Container>
      <Heading fontSize="2xl" mt={8} mb={8}>
        Current Opportunities
      </Heading>

      <Flex className={styles.listContainer}>
        <InfiniteScroll
          dataLength={jobs.length}
          next={() => {
            if (!isFetching.current) {
              isFetching.current = true;
              dispatch(listAllJobs({})).then(() => {
                isFetching.current = false;
              });
            }
          }}
          hasMore={total > jobs.length}
          loader={
            <Box key={0} display="flex" justifyContent="center" mt={14}>
              <Spinner data-testid="loading-spinner" />
            </Box>
          }
        >
          <Flex width="full" container>
            {jobs.map((job) => (
              <Flex width="full" key={JSON.stringify(job)} mb={4}>
                <ListItem {...job} onClick={onClick} />
              </Flex>
            ))}
          </Flex>
        </InfiniteScroll>
      </Flex>
    </Container>
  );
};
