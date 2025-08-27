import { Box, Wizard, WizardStep } from '@disruptive-labs/ui';
import { useRouter } from 'next/router';
import { useCallback, useState } from 'react';
import { CreateJobRequest } from '@two/shared';
import { SEO } from '@app/components/SEO';
import { WizardLayout } from '@app/components/WizardLayout';
import { selectAuthUser } from '@app/features/auth';
import { useAppDispatch, useAppSelector, useErrorIndicator } from '@app/hooks';
import { createJob } from '../actions';
import { ConfirmationStep } from './ConfirmationStep';
import { steps } from './createJobData';
import { WizardData } from './createJobDataTypes';
import { getRequestDataFromWizard } from './getRequestDataFromWizard';
import styles from './Wizard.module.scss';

export const CreateJobPage = () => {
  const user = useAppSelector(selectAuthUser);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const showError = useErrorIndicator();
  const [shouldRedirect, setShouldRedirect] = useState(!user?.employer?.availableJobsCount);

  const handleSubmit = useCallback(
    (data: WizardData) => {
      if (user) {
        setShouldRedirect(false);
        const requestData = getRequestDataFromWizard(data) as CreateJobRequest;

        dispatch(createJob(requestData))
          .unwrap()
          .then(() => {
            router.replace('/employer/create-job/confirm/');
          })
          .catch((e) => {
            showError(e);
          });
      }
    },
    [dispatch, router, showError, user],
  );

  const confirmationStep: WizardStep = {
    id: 'confirm',
    title: 'Job offer preview',
    component: <ConfirmationStep onSubmit={handleSubmit} />,
    showBackButton: true,
  };

  if (!user) {
    return null;
  }
  if (shouldRedirect) {
    router.replace('/employer');
  }

  return (
    <>
      <SEO title="Create Job" description="" />
      <Box className={styles.wizardWrapper}>
        <Wizard steps={[...steps, confirmationStep]} layout={WizardLayout} />
      </Box>
    </>
  );
};
