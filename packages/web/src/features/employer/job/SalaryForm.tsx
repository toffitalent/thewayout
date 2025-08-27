import {
  Button,
  Controller,
  Field,
  FieldComponentProps,
  FieldType,
  Flex,
  Input,
  mergeRefs,
  Text,
  useFieldArray,
  useForm,
} from '@disruptive-labs/ui';
import TrashIcon from '@disruptive-labs/ui/dist/icons/Trash';
import { ChangeEvent, forwardRef } from 'react';
import { JobSalaries } from '@two/shared';
import { formatInUsdCurrency, getSalaryValue } from '@app/utils';
import { WizardData } from './createJobDataTypes';

const validateSalary = ({
  min,
  max,
  fieldName,
}: {
  min: string;
  max: string;
  fieldName: string;
}) => {
  if (!min || !max) {
    return undefined;
  }
  const minValidate = Number(getSalaryValue(min));
  const maxValidate = Number(getSalaryValue(max));

  if (minValidate !== 0 && maxValidate !== 0 && maxValidate < minValidate) {
    return fieldName === 'min'
      ? 'Max salary must be equal or larger than the first value of range'
      : ' ';
  }
  return undefined;
};

export type SalaryWizardData = Pick<
  WizardData,
  'salary' | 'min' | 'max' | 'salaryDescription' | 'bonuses'
> &
  Partial<WizardData>;

interface SalaryFormProps {
  data: SalaryWizardData;
  salaryField: FieldComponentProps<FieldType>;
  minSalaryField: FieldComponentProps<FieldType>;
  maxSalaryField: FieldComponentProps<FieldType>;
  salaryDescriptionField: FieldComponentProps<FieldType>;
  onSubmit: (values: SalaryWizardData) => void;
  buttonLabel?: string;
}

export const SalaryForm = forwardRef(
  (
    {
      data,
      salaryField,
      minSalaryField: { validate: validateMin, ...minSalaryField },
      maxSalaryField: { validate: validateMax, ...maxSalaryField },
      salaryDescriptionField,
      onSubmit,
      buttonLabel = 'Save & Next',
    }: SalaryFormProps,
    ref: any,
  ) => {
    const {
      submitForm,
      setValue,
      watch,
      getValues,
      register,
      trigger,
      reset,
      control,
      formState: { isSubmitting, isValid, isDirty },
    } = useForm({
      mode: 'all',
      defaultValues: {
        salary: data.salary || '',
        min: data.min ? formatInUsdCurrency(data.min) : '',
        max: data.max ? formatInUsdCurrency(data.max) : '',

        salaryDescription: data.salaryDescription,
        bonuses: !data.bonuses?.length
          ? [{ value: '' }]
          : data.bonuses.map((el) => ({ value: el })),
      },
      onSubmit: async ({ salary, min, max, salaryDescription, bonuses }) => {
        if (salary) {
          onSubmit({
            ...data,
            salary,
            min: getSalaryValue(min),
            max: getSalaryValue(max),
            salaryDescription,
            bonuses: bonuses.map((el) => el.value).filter((bonus) => !!bonus),
          });
          reset(getValues());
        }
      },
    });

    const { fields, append, remove } = useFieldArray({ control, name: 'bonuses' });
    const watchFieldArray = watch('bonuses');
    const controlledFields = fields.map((field, index) => ({
      ...field,
      ...watchFieldArray[index],
    }));

    return (
      <form onSubmit={submitForm}>
        <Field
          {...salaryField}
          onChangeCapture={(el: any) => {
            setValue('salary', el.target.value);
            setValue(
              'min',
              formatInUsdCurrency(el.target.value === JobSalaries.hourly ? '15' : '31200'),
            );
          }}
          control={control}
        />
        <Controller
          name="min"
          control={control}
          rules={{
            ...validateMin,
            ...(getValues('min') && {
              validate: () =>
                Number(getSalaryValue(getValues('min'))) < 1
                  ? 'Minimum value is 1.'
                  : validateSalary({
                      min: getValues('min'),
                      max: getValues('max'),
                      fieldName: 'min',
                    }),
            }),
          }}
          render={({
            field: { onBlur, value, ref: controllerRef },
            fieldState: { error, invalid },
          }) => (
            <Input
              {...(minSalaryField as FieldComponentProps<'text'>)}
              placeholder="Min salary"
              invalid={invalid}
              onBlur={onBlur}
              onChange={(event: ChangeEvent<any>) => {
                setValue('min', formatInUsdCurrency(event.target.value), { shouldDirty: true });
                trigger('max');
              }}
              ref={mergeRefs(ref, controllerRef)}
              type="text"
              value={value}
              helperText={error?.message}
            />
          )}
        />
        <Controller
          name="max"
          control={control}
          rules={{
            ...validateMax,
            ...(getValues('max') && {
              validate: () =>
                Number(getSalaryValue(getValues('max'))) < 1
                  ? 'Minimum value is 1.'
                  : validateSalary({
                      min: getValues('min'),
                      max: getValues('max'),
                      fieldName: 'max',
                    }),
            }),
          }}
          render={({
            field: { onBlur, value, ref: controllerRef },
            fieldState: { error, invalid },
          }) => (
            <Input
              {...(maxSalaryField as FieldComponentProps<'text'>)}
              placeholder={`Max ${watch('salary') || ''} salary`}
              invalid={invalid}
              onBlur={onBlur}
              onChange={(event: ChangeEvent<any>) => {
                setValue('max', formatInUsdCurrency(event.target.value), { shouldDirty: true });
                trigger('min');
              }}
              ref={mergeRefs(ref, controllerRef)}
              type="text"
              value={value}
              helperText={error?.message}
            />
          )}
        />
        <Field {...salaryDescriptionField} control={control} />
        <Flex textAlign="left" mt={4}>
          <Text mb={2} fontWeight="700">
            Add Bonus
          </Text>
          {controlledFields.map((bonus, index) => (
            <Flex mb={3} key={bonus.id}>
              {bonus && bonus.value !== '' && (
                <Flex justify="flex-end" display="flex" mb={1}>
                  <TrashIcon
                    height={6}
                    width={6}
                    color="primary"
                    onClick={() => {
                      remove(index);
                      if (controlledFields.length === 1) append({ value: '' });
                    }}
                  />
                </Flex>
              )}
              <Field
                id={bonus.id}
                {...register(`bonuses.${index}.value` as const)}
                type="text"
                multiline
                placeholder="Additional $100 Bonus for Positive 90 Day Review"
                value={bonus.value}
                fluid
                control={control}
                ref={ref}
                validate={{ maxLength: 1000 }}
                helperText="Max 1,000 characters."
              />
            </Flex>
          ))}
          <Button
            variant="outline"
            onClick={() => append({ value: '' })}
            mt={5}
            colorScheme="primary"
            disabled={!controlledFields[controlledFields.length - 1]?.value.length}
          >
            Add more
          </Button>
        </Flex>
        <Button
          colorScheme="primary"
          fluid
          type="submit"
          maxWidth={96}
          mt={8}
          disabled={isSubmitting || !isValid || !isDirty}
        >
          {buttonLabel}
        </Button>
      </form>
    );
  },
);
