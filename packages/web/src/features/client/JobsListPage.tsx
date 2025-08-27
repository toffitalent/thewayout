import { Box, Flex, Heading, Spinner } from '@disruptive-labs/ui';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useRef } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { SEO } from '@app/components/SEO';
import { useAppDispatch, useAppSelector } from '@app/hooks';
import { selectAuthUser } from '../auth';
import { listAllJobs } from './actions';
import styles from './JobsListPage.module.scss';
import { ListItem } from './ListItem';
import { selectAllJobsList, selectTotalJobs } from './reducer';

export const JobsListPage = () => {
  const router = useRouter();
  const user = useAppSelector(selectAuthUser);
  const dispatch = useAppDispatch();
  const isFetching = useRef(false);
  const jobs = useAppSelector(selectAllJobsList);
  const total = useAppSelector(selectTotalJobs);

  useEffect(() => {
    if (user?.id) {
      isFetching.current = true;
      dispatch(listAllJobs({}))
        .unwrap()
        .then(() => {
          isFetching.current = false;
        });
    }
  }, [dispatch, user?.id]);

  const onClick = useCallback(
    (id: string) => router.push(`/client/jobs/${id}/`),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  return (
    <>
      <SEO title="Job Postings" />
      <Flex>
        <Heading fontSize="3xl" mb={8}>
          Job Postings
        </Heading>

        <Flex className={styles.listContainer}>
          <InfiniteScroll
            dataLength={jobs.length}
            next={() => {
              if (!isFetching.current) {
                isFetching.current = true;
                if (user?.id) {
                  dispatch(listAllJobs({})).then(() => {
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
            <Flex width="full" container>
              {jobs.map((job) => (
                <Flex width="full" key={JSON.stringify(job)} mb={4}>
                  <ListItem {...job} onClick={onClick} />
                </Flex>
              ))}
            </Flex>
          </InfiniteScroll>
        </Flex>
      </Flex>
    </>
  );
};
