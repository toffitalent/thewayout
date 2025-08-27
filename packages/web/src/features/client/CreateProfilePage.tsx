import { Box, Toast, Wizard } from '@disruptive-labs/ui';
import { useRouter } from 'next/router';
import { SEO } from '@app/components/SEO';
import { WizardLayout } from '@app/components/WizardLayout';
import { useAppDispatch, useAppSelector, useErrorIndicator } from '@app/hooks';
import { getClientDataFromWizard } from '@app/utils';
import { selectAuthUser } from '../auth';
import { createClient } from './actions';
import styles from './CreateProfilePage.module.scss';
import { steps } from './profileData';
import { WizardData } from './profileDataTypes';

export const CreateProfilePage = () => {
  const user = useAppSelector(selectAuthUser);
  const dispatch = useAppDispatch();
  const showError = useErrorIndicator();
  const router = useRouter();

  const handleSave = (data: WizardData) => {
    dispatch(createClient(getClientDataFromWizard(data, true)))
      .unwrap()
      .catch((e) => {
        showError(e);
      })
      .then(() => {
        Toast.success('Profile added!');
      });
  };

  if (!user) {
    return null;
  }
  if (user.client) {
    router.push('/client/');
    return null;
  }

  const lastStep = steps.pop();
  if (lastStep) {
    lastStep.nextStep = (data) => handleSave(data as WizardData);
    steps.push(lastStep);
  }

  return (
    <>
      <SEO title="Create Profile" description="" />
      <Box className={styles.wizardWrapper}>
        <Wizard steps={steps} layout={WizardLayout} />
      </Box>
    </>
  );
};
