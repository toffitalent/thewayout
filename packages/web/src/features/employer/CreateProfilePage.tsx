import { Box, Wizard, WizardStep } from '@disruptive-labs/ui';
import { useRouter } from 'next/router';
import { useCallback } from 'react';
import { EmployerCreateRequest as WizardData } from '@two/shared';
import { SEO } from '@app/components/SEO';
import { WizardLayout } from '@app/components/WizardLayout';
import { useAppDispatch, useAppSelector, useErrorIndicator } from '@app/hooks';
import { selectAuthUser } from '../auth';
import { createEmployer } from './actions';
import { ConfirmationStep } from './ConfirmationStep';
import styles from './CreatorProfile.module.scss';
import { steps } from './profileData';

export const CreateProfilePage = () => {
  const user = useAppSelector(selectAuthUser);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const showError = useErrorIndicator();

  const handleSubmit = useCallback(
    (data: WizardData) => {
      if (user) {
        dispatch(createEmployer(data))
          .unwrap()
          .then(() => {
            router.push('/employer/create-profile/confirm/');
          })
          .catch((e) => {
            showError(e);
          });
      }
    },
    [dispatch, router, showError, user],
  );

  if (!user) {
    return null;
  }

  const confirmationStep: WizardStep = {
    id: 'confirm',
    title: 'Confirm your data',
    component: <ConfirmationStep onSubmit={handleSubmit} />,
    showBackButton: true,
  };

  return (
    <>
      <SEO title="Create Profile" description="" />
      <Box className={styles.wizardWrapper}>
        <Wizard steps={[...steps, confirmationStep]} layout={WizardLayout} />
      </Box>
    </>
  );
};
