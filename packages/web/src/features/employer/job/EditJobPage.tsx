import {
  Box,
  Button,
  Field,
  FieldComponentProps,
  FieldType,
  Flex,
  FlexComponentProps,
  Heading,
  Spinner,
  Text,
  Toast,
  useFieldArray,
  useForm,
  WizardChoices,
  WizardStep,
} from '@disruptive-labs/ui';
import TrashIcon from '@disruptive-labs/ui/dist/icons/Trash';
import { useRouter } from 'next/router';
import { forwardRef, ReactNode, useCallback, useEffect } from 'react';
import { TypeOfWork, VeteranOrJustice } from '@two/shared';
import { SEO } from '@app/components/SEO';
import { selectAuthUser } from '@app/features/auth';
import { useAppDispatch, useAppSelector, useErrorIndicator, useIsTablet } from '@app/hooks';
import { allOffenses, emptyOffenses } from '@app/utils/getWizardOffense';
import { retrieveJob, updateJob } from '../actions';
import { selectJob } from '../reducer';
import { Steps, steps } from './createJobData';
import { WizardData } from './createJobDataTypes';
import { validateStartAt } from './customFieldsValidation';
import styles from './EditJobPage.module.scss';
import { getRequestDataFromWizard, getWizardJob } from './getRequestDataFromWizard';
import { SalaryForm, SalaryWizardData } from './SalaryForm';

const jobSection: {
  [key: string]: { title?: string; description?: (companyName: string) => string };
} = {
  [Steps.details]: { title: 'Job Details' },
  [Steps.location]: { title: 'Job Location' },
  [Steps.veteranOrJustice]: {
    title: 'Allowed Applicants',
    description: (companyName) =>
      `We will only recommend ${companyName} to candidates that meet the selected attribute(s).`,
  },
  [Steps.offenses]: {
    description: (companyName) =>
      `We will only recommend ${companyName} to candidates that meet your allowable offenses (per State and Federal statutes).`,
  },
};

interface FormItemProps {
  step: WizardStep;
  defaultValues: Partial<WizardData>;
  handleSave: (data: Partial<WizardData>) => void;
}

interface SectionProps extends FlexComponentProps {
  title: string | ReactNode;
  description?: string;
  children: ReactNode;
}

const Section = ({ title, description, children, ...props }: SectionProps) => (
  <Flex
    width="full"
    mt={8}
    direction="row"
    borderBottom
    pb={5}
    className={styles.wizardWrapper}
    container
    {...props}
  >
    <Flex item xs={12} md={4} pr={5} mb={8}>
      <Text fontSize="xl" fontWeight="700">
        {title}
      </Text>
      {description && (
        <Text fontSize="sm" color="grey.600">
          {description}
        </Text>
      )}
    </Flex>
    <Flex item xs={12} md={8}>
      {children}
    </Flex>
  </Flex>
);

const ArrayFormItem = forwardRef(({ step, defaultValues, handleSave }: FormItemProps, ref: any) => {
  const arrayFields: {
    [key: string]: { name: keyof WizardData; title: string; placeholder: string };
  } = {
    [Steps.responsibilities]: {
      name: 'responsibilities',
      title: 'Responsibility',
      placeholder: 'E.g. Always be ready to assist customers with menu options and payment.',
    },
    [Steps.questions]: {
      name: 'questions',
      title: 'Question',
      placeholder: 'E.g. Do you have a driver license?',
    },
  };
  const stepId = step.id as keyof WizardData;
  const fieldName = arrayFields[stepId].name;

  const arrayDefaultValues = {
    [stepId]:
      defaultValues[stepId] && (defaultValues[stepId] as string[]).length
        ? (defaultValues[stepId] as string[]).map((el) => ({ value: el }))
        : [{ value: '' }],
  };

  const {
    submitForm,
    register,
    watch,
    getValues,
    reset,
    control,
    formState: { isSubmitting, isDirty },
  } = useForm({
    defaultValues: arrayDefaultValues,
    onSubmit: (values) => {
      handleSave({ [stepId]: values[stepId].map((el) => el.value) });
      reset(getValues());
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: fieldName });
  const watchFieldArray = watch(fieldName);
  const controlledFields = fields.map((field, index) => ({
    ...field,
    ...watchFieldArray[index],
  }));

  const isDisabledArrayButton = () => {
    const arrValues = getValues()[fieldName] as { value: string }[] | undefined;

    return arrValues && arrValues.length ? !arrValues[arrValues.length - 1].value.length : true;
  };

  return (
    <form onSubmit={submitForm}>
      <Flex textAlign="left" width="full">
        {controlledFields.map((field, index) => (
          <Flex mb={3} key={field.id}>
            <Flex mb={3} direction="row" justify="space-between">
              <Text fontWeight="700">{`${arrayFields[step.id].title} #${index + 1}`}</Text>
              {field && field.value !== '' && (
                <TrashIcon
                  height={6}
                  width={6}
                  color="primary"
                  onClick={() => {
                    remove(index);
                    if (controlledFields.length === 1) append({ value: '' });
                  }}
                />
              )}
            </Flex>
            <Field
              id={field.id}
              {...register(`${fieldName}.${index}.value` as const)}
              type="text"
              multiline
              placeholder={arrayFields[stepId].placeholder}
              fluid
              control={control}
              ref={ref}
              helperText="Max 1,000 characters."
              validate={{ maxLength: 1000 }}
            />
          </Flex>
        ))}
        <Button
          variant="outline"
          onClick={() => append({ value: '' })}
          mt={5}
          colorScheme="primary"
          disabled={isDisabledArrayButton()}
        >
          Add more
        </Button>
      </Flex>

      <Button mt={5} colorScheme="primary" type="submit" disabled={isSubmitting || !isDirty}>
        Save
      </Button>
    </form>
  );
});

const FormItem = ({ step, defaultValues, handleSave }: FormItemProps) => {
  const isTablet = useIsTablet();

  const handleSubmit = (values: Partial<WizardData>) => {
    let clearOffenses;
    if (
      step.id === Steps.veteranOrJustice &&
      values.veteranOrJustice &&
      !values.veteranOrJustice.includes(VeteranOrJustice.justiceImpacted)
    ) {
      clearOffenses = { offenses: null };
    }
    handleSave({ ...values, ...(clearOffenses && clearOffenses) });
    reset(getValues());
  };

  const {
    submitForm,
    setError,
    clearErrors,
    setValue,
    getValues,
    trigger,
    reset,
    control,
    formState: { isSubmitting, isDirty, isValid },
  } = useForm({
    mode: 'onChange',
    defaultValues,
    onSubmit: handleSubmit,
  });

  return (
    <form onSubmit={submitForm}>
      {step.id === Steps.offenses && (
        <Box mb={4}>
          <Button
            onClick={() =>
              Object.entries(allOffenses).forEach(([name, value]) =>
                setValue(name as keyof WizardData, value, { shouldDirty: true }),
              )
            }
            variant="outline"
          >
            Select All
          </Button>
          <Button
            onClick={() =>
              Object.entries(emptyOffenses).forEach(([name, value]) =>
                setValue(name as keyof WizardData, value, { shouldDirty: true }),
              )
            }
            variant="text"
            p={4}
            ml={1}
          >
            Clear All
          </Button>
        </Box>
      )}

      {step.fields?.map((field) => {
        switch (field.type) {
          case 'choices':
            return <WizardChoices key={field.name} {...field} pv={3} control={control} />;
          case 'checkbox':
          case 'radio':
          case 'toggle':
            return <Field key={field.name} {...field} control={control} />;
          default:
            return (
              <Field
                key={field.name}
                {...field}
                fluid
                validate={{
                  ...field.validate,
                  ...((field.name === 'startAtMonth' || field.name === 'startAtYear') && {
                    validate: () => {
                      const error = validateStartAt({
                        startAtMonth: getValues('startAtMonth'),
                        startAtYear: getValues('startAtYear'),
                        fieldName: field.name,
                      });
                      if (error) {
                        setError(field.name as 'startAtMonth' | 'startAtYear', {
                          message: error,
                          type: 'validate',
                        });
                      } else {
                        clearErrors(field.name as 'startAtMonth' | 'startAtYear');
                      }
                      return error;
                    },
                  }),
                }}
                onChangeCapture={() => {
                  if (field.name === 'startAtMonth' || field.name === 'startAtYear') {
                    const anotherFieldName =
                      field.name === 'startAtMonth' ? 'startAtYear' : 'startAtMonth';
                    const secondField = getValues(anotherFieldName);
                    if (secondField) {
                      trigger(anotherFieldName);
                    }
                  }
                }}
                control={control}
              />
            );
        }
      })}

      <Button
        mt={5}
        colorScheme="primary"
        type="submit"
        disabled={isSubmitting || !isDirty || !isValid}
        maxWidth={isTablet ? 96 : undefined}
      >
        Save
      </Button>
    </form>
  );
};

export const EditJobPage = () => {
  const user = useAppSelector(selectAuthUser);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const showError = useErrorIndicator();
  const { id } = router.query;
  const job = useAppSelector(selectJob);

  const arraySteps = [Steps.responsibilities, Steps.questions];

  const salaryFields = steps.find((el) => el.id === Steps.pay)
    ?.fields as FieldComponentProps<FieldType>[];

  let stepsToShow = [...steps];
  if (job?.typeOfWork !== TypeOfWork.onsite) {
    stepsToShow = stepsToShow.filter((el) => el.id !== Steps.location);
  }

  useEffect(() => {
    if (id) {
      dispatch(retrieveJob({ jobId: id as string }))
        .unwrap()
        .catch((e) => showError(e));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, dispatch, user?.employer]);

  const handleSubmit = useCallback(
    (data: Partial<WizardData>) => {
      if (user) {
        const patch = getRequestDataFromWizard(data);

        if (id) {
          dispatch(updateJob({ jobId: id as string, patch }))
            .unwrap()
            .then(() => Toast.success('Job Offer Updated!'))
            .catch((e) => {
              showError(e);
            });
        }
      }
    },
    [dispatch, id, showError, user],
  );

  if (!job || job.id !== id || !user) {
    return (
      <Box pv={36} textAlign="center">
        <Spinner data-testid="loading-spinner" />
      </Box>
    );
  }

  const getPartialJob = (step: WizardStep) => {
    const wizardJob = getWizardJob(job);
    let keys = step.fields?.map((field) => field.name) as (keyof WizardData)[];
    if (step.id === Steps.responsibilities) keys = ['responsibilities'];
    if (step.id === Steps.questions) keys = ['questions'];
    if (step.id === Steps.pay) keys.push('bonuses');
    const res = keys
      ? Object.fromEntries(
          keys.filter((key) => key in wizardJob!).map((key) => [key, wizardJob![key]]),
        )
      : {};

    return res;
  };

  return (
    <Flex direction="column">
      <SEO title="Edit Job" description="" />
      <Heading size="3xl">Job Settings</Heading>
      <Text mt={2} color="grey.600">
        Manage your job settings here.
      </Text>
      {stepsToShow.map((step) => (
        <Section
          title={jobSection[step.id]?.title || step.title}
          description={
            jobSection[step.id]?.description && user.employer?.name
              ? jobSection[step.id].description!(user.employer?.name)
              : undefined
          }
          key={step.id}
          display={
            step.id === Steps.offenses &&
            !job.veteranOrJustice.includes(VeteranOrJustice.justiceImpacted)
              ? 'none'
              : undefined
          }
          data-testid={step.id}
        >
          {step.id !== Steps.pay && !arraySteps.includes(step.id as Steps) && (
            <FormItem step={step} handleSave={handleSubmit} defaultValues={getPartialJob(step)} />
          )}

          {step.id !== Steps.pay && arraySteps.includes(step.id as Steps) && (
            <ArrayFormItem
              step={step}
              handleSave={handleSubmit}
              defaultValues={getPartialJob(step)}
            />
          )}

          {step.id === Steps.pay && (
            <Box className={styles.salaryForm}>
              <SalaryForm
                data={getPartialJob(step) as unknown as SalaryWizardData}
                salaryField={salaryFields[0]}
                minSalaryField={salaryFields[1]}
                maxSalaryField={salaryFields[2]}
                salaryDescriptionField={salaryFields[3]}
                onSubmit={handleSubmit}
                buttonLabel="Save"
              />
            </Box>
          )}
        </Section>
      ))}
    </Flex>
  );
};
