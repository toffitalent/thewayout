import { Box, Container, Spinner } from '@disruptive-labs/ui';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { JobPreview } from '@app/components/JobPreview';
import { selectJobById } from '@app/features/client';
import { retrieveJob } from '@app/features/client/actions';
import { useAppDispatch, useAppSelector } from '@app/hooks';

export const JobPage = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { id } = router.query;
  const job = useAppSelector((state) => selectJobById(state, String(id)));

  useEffect(() => {
    if (id) {
      dispatch(
        retrieveJob({
          jobId: id as string,
          ...(job && { since: job.updatedAt }),
        }),
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, dispatch]);

  if (!job) {
    return (
      <Box pv={36} textAlign="center">
        <Spinner data-testid="loading-spinner" />
      </Box>
    );
  }

  const handleApply = () =>
    router.push({ pathname: '/signup', query: { return_to: `/client/jobs/${id}` } });

  return (
    <Container>
      <JobPreview job={job} handleApply={handleApply} isApplied={false} />
    </Container>
  );
};
