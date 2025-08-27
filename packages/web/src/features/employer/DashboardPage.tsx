import { Box, Button, Flex, Heading, Spinner } from '@disruptive-labs/ui';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { UserType } from '@two/shared';
import { SidebarLayout } from '@app/components/Layout';
import { SEO } from '@app/components/SEO';
import { selectAuthUser } from '@app/features/auth';
import { useAppDispatch, useAppSelector } from '@app/hooks';
import { listJobs } from './actions';
import { SubscriptionsPlansLimitModal } from './components/SubscriptionsPlansLimitModal';
import styles from './DashboardPage.module.scss';
import { ListItem } from './ListItem';
import { selectAllJobs, selectTotalJobs } from './reducer';

export function DashboardPage() {
  const user = useAppSelector(selectAuthUser);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const jobs = useAppSelector(selectAllJobs);
  const total = useAppSelector(selectTotalJobs);
  const isFetching = useRef(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // retrieve new results if store is empty
    if (user?.id && !jobs.length) {
      isFetching.current = true;
      dispatch(listJobs({ userId: user?.id }))
        .unwrap()
        .then(() => {
          isFetching.current = false;
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, user?.id]);

  const handleClick = (id: string) => router.push(`/employer/jobs/${id}/`);

  if (!user?.employer) {
    return (
      <Box pv={20} textAlign="center">
        <Spinner color="primary" />
      </Box>
    );
  }

  return (
    <>
      <SEO title="Job Postings" />
      <SidebarLayout type={UserType.Employer}>
        <Flex width="full">
          <Flex justify="space-between" display="flex" container>
            <Flex display="flex" alignItems="center" item xs={12} sm={6}>
              <Heading fontSize="3xl">Job Postings</Heading>
            </Flex>
            <Flex className={styles.postJob} item xs={12} sm={6}>
              <Button
                colorScheme="primary"
                onClick={() =>
                  !user?.employer?.availableJobsCount
                    ? setIsOpen(true)
                    : router.push('/employer/create-job')
                }
              >
                Create New Job Offer
              </Button>
            </Flex>
          </Flex>
          <Flex mt={8}>
            <InfiniteScroll
              dataLength={jobs.length}
              next={() => {
                if (!isFetching.current) {
                  isFetching.current = true;
                  if (user?.id) {
                    dispatch(listJobs({ userId: user?.id })).then(() => {
                      isFetching.current = false;
                    });
                  }
                }
              }}
              hasMore={total > jobs.length}
              loader={
                <Box key={0} display="flex" justifyContent="center" mt={14}>
                  <Spinner />
                </Box>
              }
            >
              <Flex width="full" container>
                {jobs.map((job) => (
                  <Flex width="full" key={JSON.stringify(job)}>
                    <ListItem {...job} onClick={handleClick} />
                  </Flex>
                ))}
              </Flex>
            </InfiniteScroll>
          </Flex>
          <SubscriptionsPlansLimitModal
            isOpen={isOpen}
            type="job"
            onClose={() => setIsOpen(false)}
          />
        </Flex>
      </SidebarLayout>
    </>
  );
}
