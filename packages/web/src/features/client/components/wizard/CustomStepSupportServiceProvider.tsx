import { Button, useForm, useWizardContext, WizardChoices } from '@disruptive-labs/ui';
import ArrowNarrowRight from '@disruptive-labs/ui/dist/icons/ArrowNarrowRight';
import { useEffect } from 'react';
import { needReentryPipeline } from '@two/shared';
import { selectAuthUser } from '@app/features/auth';
import { listRsp } from '@app/features/client/actions';
import { useAppDispatch, useAppSelector } from '@app/hooks';
import { WizardData } from '../../profileDataTypes';
import { selectAllRsp } from '../../reducer';

export const CustomStepSupportServiceProvider = () => {
  const { data, next } = useWizardContext<WizardData>();
  const user = useAppSelector(selectAuthUser);
  const dispatch = useAppDispatch();
  const rspList = useAppSelector(selectAllRsp);

  useEffect(() => {
    if (user) {
      dispatch(listRsp({ userId: user.id }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const {
    submitForm,
    control,
    formState: { isValid, isDirty },
  } = useForm({
    defaultValues: {
      rspId: data.isNewRspMember ? needReentryPipeline.value : data.rspId,
    },
    onSubmit: async ({ rspId }) => {
      const needReentryPipelineChosen = rspId === needReentryPipeline.value;
      await next({
        ...(isDirty && {
          rspId: !needReentryPipelineChosen ? rspId : undefined,
          isNewRspMember: needReentryPipelineChosen,
        }),
      });
    },
  });

  const options = rspList.map((rsp) => ({ label: rsp.name, value: rsp.id }));
  options.push(needReentryPipeline);

  return (
    <form onSubmit={submitForm}>
      <WizardChoices
        options={options}
        name="rspId"
        type="choices"
        inline
        validate={{ required: true }}
        control={control}
      />
      <Button
        colorScheme="primary"
        fluid
        type="submit"
        maxWidth={96}
        mt={8}
        accessoryRight={<ArrowNarrowRight />}
        disabled={!isValid}
      >
        Next
      </Button>
    </form>
  );
};
