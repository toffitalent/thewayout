import { Box, Toast, Wizard } from '@disruptive-labs/ui';
import { useRouter } from 'next/router';
import { RspRole, VeteranOrJustice } from '@two/shared';
import { SEO } from '@app/components/SEO';
import { WizardLayout } from '@app/components/WizardLayout';
import { useAppDispatch, useAppSelector, useErrorIndicator } from '@app/hooks';
import { selectAuthUser } from '../auth';
import { createMember, createRsp } from './actions';
import styles from './CreateProfilePage.module.scss';
import {
  memberProfileSteps,
  ownerProfileSteps,
  RspSteps,
  rspSteps,
  WizardRspData,
} from './rspData';

const getRspRequestData = (data: WizardRspData) => {
  const {
    phone,
    position,
    avatar,
    offenseDrugs,
    offenseMotorVehicle,
    offensePropertyDamage,
    offenseSexual,
    offenseTheft,
    offenseViolent,
    offenseWhiteCollar,
    phoneRspContact,
    emailRspContact,
    avatarRsp,
    ...rsp
  } = data;

  delete rsp.avatarUrl;
  delete rsp.avatarRspUrl;

  return {
    ...rsp,
    avatar: avatarRsp,
    phone: phoneRspContact,
    email: emailRspContact,
    offenses: [
      ...(offenseDrugs || []),
      ...(offensePropertyDamage || []),
      ...(offenseSexual || []),
      ...(offenseTheft || []),
      ...(offenseViolent || []),
      ...(offenseWhiteCollar || []),
      ...(offenseMotorVehicle || []),
    ],
    owner: { phone, position, avatar },
  };
};

export const CreateProfilePage = () => {
  const user = useAppSelector(selectAuthUser);
  const router = useRouter();
  const showError = useErrorIndicator({ ResourceConflict: 'Organization name already exist' });
  const dispatch = useAppDispatch();

  const handleSaveRsp = (data: WizardRspData) => {
    dispatch(createRsp(getRspRequestData(data)))
      .unwrap()
      .catch((e) => {
        showError(e);
      })
      .then(() => {
        Toast.success('Organization added!');
      });
  };

  const handleSaveMember = (data: WizardRspData) => {
    dispatch(
      createMember({
        ...data,
        userId: user?.id as string,
        rspId: user?.rspAccount?.rspId as string,
      }),
    )
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
  if (user.rspAccount?.isProfileFilled) {
    router.push(user.rspAccount.role === RspRole.owner ? '/ssp/case-managers' : '/ssp/clients');
    return null;
  }

  const isOwner = user.rspAccount?.role === RspRole.owner;

  let steps = memberProfileSteps;
  if (isOwner) {
    steps = [...memberProfileSteps, ...ownerProfileSteps, ...rspSteps];
  }

  if (isOwner) {
    const indexOfContact = steps.findIndex((el) => el.id === RspSteps.contact);
    steps[indexOfContact].nextStep = (data) => {
      if ((data as WizardRspData).veteranOrJustice.includes(VeteranOrJustice.justiceImpacted)) {
        return RspSteps.justiceStatus;
      }
      handleSaveRsp(data);
      return RspSteps.contact;
    };
  }

  const lastStep = steps.pop();
  if (lastStep) {
    lastStep.nextStep = (data) => (isOwner ? handleSaveRsp(data) : handleSaveMember(data));
    steps.push(lastStep);
  }

  return (
    <>
      <SEO title="" description="" />
      <Box className={styles.wizardWrapper}>
        <Wizard
          steps={steps}
          layout={WizardLayout}
          initialData={user.phone ? ({ phone: user.phone } as any) : undefined}
        />
      </Box>
    </>
  );
};
