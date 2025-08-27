import {
  Button,
  Field,
  FieldComponentProps,
  FieldType,
  useForm,
  useWizardContext,
  WizardStep,
} from '@disruptive-labs/ui';
import { WizardData } from './createJobDataTypes';
import { validateStartAt } from './customFieldsValidation';

export interface CustomStepProps extends Omit<Partial<WizardStep>, 'fields'> {
  fields?: FieldComponentProps<FieldType>[];
}

export const CustomStepDetails = (props: CustomStepProps) => {
  const { next, data } = useWizardContext<WizardData>();

  const {
    submitForm,
    control,
    formState: { isSubmitting, isDirty, isValid },
    getValues,
    trigger,
    setError,
    clearErrors,
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      title: data.title || '',
      description: data.description || '',
      department: data.department || '',
      startAtMonth: data.startAtMonth || '',
      startAtYear: data.startAtYear || '',
      typeOfWork: data.typeOfWork || '',
      workingTime: data.workingTime || '',
      numberOfOpenPositions: data.numberOfOpenPositions || '',
    },
    onSubmit: async (values) => {
      await next({
        ...data,
        ...values,
        numberOfOpenPositions: Number(values.numberOfOpenPositions),
      });
    },
  });

  const { fields, nextButtonLabel } = props;
  if (!fields) {
    return null;
  }

  return (
    <form onSubmit={submitForm} className="detailsStep">
      {fields.map((field) => (
        <Field
          {...field}
          key={field.name}
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
      ))}
      <Button
        colorScheme="primary"
        fluid
        type="submit"
        maxWidth={96}
        mt={8}
        disabled={isSubmitting || !isValid || (!data.salary && !isDirty)}
      >
        {nextButtonLabel || ''}
      </Button>
    </form>
  );
};
