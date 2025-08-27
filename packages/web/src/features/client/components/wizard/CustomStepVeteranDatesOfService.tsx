import {
  Button,
  Field,
  FieldComponentProps,
  FieldType,
  Flex,
  useForm,
  useWizardContext,
  WizardStep,
} from '@disruptive-labs/ui';
import { WizardData } from '../../profileDataTypes';

export interface CustomStepProps extends Omit<Partial<WizardStep>, 'fields'> {
  fields?: FieldComponentProps<FieldType>[];
}

type VeteranDatesOfServiceWizardData = Pick<
  WizardData,
  'veteranStartAtMonth' | 'veteranStartAtYear' | 'veteranEndAtMonth' | 'veteranEndAtYear'
> &
  Partial<WizardData>;

export const CustomStepVeteranDatesOfService = (props: CustomStepProps) => {
  const { next, data } = useWizardContext<VeteranDatesOfServiceWizardData>();

  const {
    control,
    formState: { isSubmitting, isValid },
    trigger,
    getValues,
    setError,
    clearErrors,
    submitForm,
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      veteranStartAtMonth: data.veteranStartAtMonth || '',
      veteranStartAtYear: data.veteranStartAtYear || '',
      veteranEndAtMonth: data.veteranEndAtMonth || '',
      veteranEndAtYear: data.veteranEndAtYear || '',
    },
    onSubmit: async (values: VeteranDatesOfServiceWizardData) => {
      await next(values);
    },
  });

  const validateEndDate = () => {
    const [startMonth, startYear, endMonth, endYear] = getValues([
      'veteranStartAtMonth',
      'veteranStartAtYear',
      'veteranEndAtMonth',
      'veteranEndAtYear',
    ]);

    if (endMonth && endYear) {
      const startDate = new Date(Number(startYear), Number(startMonth));
      const endDate = new Date(Number(endYear), Number(endMonth));

      return endDate >= startDate ? undefined : 'error';
    }

    return undefined;
  };

  const { fields, nextButtonLabel } = props;
  if (!fields) {
    return null;
  }
  const [veteranStartAtMonth, veteranStartAtYear, veteranEndAtMonth, veteranEndAtYear] = fields;

  return (
    <Flex maxWidth={96} ml="auto" mr="auto">
      <form onSubmit={submitForm}>
        <Field {...veteranStartAtMonth} control={control} />
        <Field {...veteranStartAtYear} control={control} />
        <Field
          {...veteranEndAtMonth}
          control={control}
          validate={{
            ...veteranEndAtMonth.validate,
            validate: () => {
              const error = validateEndDate();
              if (error) {
                setError('veteranEndAtMonth', {
                  message: 'End date must be after start date',
                  type: 'validate',
                });
              } else {
                clearErrors('veteranEndAtMonth');
              }
              return error ? 'End date must be after start date' : undefined;
            },
          }}
          onChangeCapture={() => {
            if (getValues('veteranEndAtYear')) {
              trigger('veteranEndAtYear');
            }
          }}
        />
        <Field
          {...veteranEndAtYear}
          control={control}
          validate={{
            ...veteranEndAtYear.validate,
            validate: () => {
              const error = validateEndDate();
              if (error) {
                setError('veteranEndAtYear', {
                  message: ' ',
                  type: 'validate',
                });
              } else {
                clearErrors('veteranEndAtYear');
              }
              return error ? ' ' : undefined;
            },
          }}
          onChangeCapture={() => {
            if (getValues('veteranEndAtMonth')) {
              trigger('veteranEndAtMonth');
            }
          }}
        />
        <Button
          colorScheme="primary"
          fluid
          type="submit"
          maxWidth={96}
          mt={8}
          disabled={isSubmitting || !isValid}
        >
          {nextButtonLabel}
        </Button>
      </form>
    </Flex>
  );
};
