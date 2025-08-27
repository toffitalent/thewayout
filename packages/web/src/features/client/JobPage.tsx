import { Box, Spinner, Toast } from '@disruptive-labs/ui';
import { useRouter } from 'next/router';
import { useCallback, useEffect } from 'react';
import { JusticeStatus } from '@two/shared';
import { JobPreview } from '@app/components/JobPreview';
import { SEO } from '@app/components/SEO';
import { useAppDispatch, useAppSelector, useErrorIndicator } from '@app/hooks';
import { selectAuthUser } from '../auth';
import { applyJob, retrieveJob } from './actions';
import { selectJobById } from './reducer';

export const JobPage = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const showError = useErrorIndicator({
    RequestThrottled:
      "You've reached your application limit for today. Check back tomorrow to continue applying.",
  });
  const user = useAppSelector(selectAuthUser);
  const { id } = router.query;
  const job = useAppSelector((state) => selectJobById(state, String(id)));
  const isApplied = !!job?.applications?.length;
  const isClientIncarcerated = user?.client?.justiceStatus === JusticeStatus.currentlyIncarcerated;

  useEffect(() => {
    if (user?.id && id) {
      dispatch(
        retrieveJob({
          jobId: id as string,
          ...(job && job.applications && { since: job.updatedAt }),
        }),
      )
        .unwrap()
        .catch((e: any) => {
          if (e.code === 'ResourceNotFound') {
            router.replace('/client/jobs');
          }
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, id, dispatch]);

  const handleApply = useCallback(
    () =>
      dispatch(applyJob({ jobId: id as string }))
        .unwrap()
        .then(() => {
          Toast.success('Your application was successful!');
          router.replace('/client/');
        })
        .catch((e) => showError(e)),
    [dispatch, id, router, showError],
  );

  if (!job) {
    return (
      <Box pv={36} textAlign="center">
        <Spinner data-testid="loading-spinner" />
      </Box>
    );
  }

  return (
    <>
      <SEO title={`${job.title}`} />
      <JobPreview
        job={job}
        handleApply={
          job.questions?.length ? () => router.push(`/client/jobs/questions/${id}`) : handleApply
        }
        isApplied={isApplied}
        isDisabled={isClientIncarcerated || isApplied}
        helperText={
          isClientIncarcerated
            ? 'You will be able to apply for jobs as soon as you are in the “free world”. In the meantime, a Supportive Services Provider should be reaching out to you shortly.'
            : undefined
        }
      />
    </>
  );
};
