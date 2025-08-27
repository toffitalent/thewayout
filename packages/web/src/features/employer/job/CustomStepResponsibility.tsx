import {
  Button,
  Field,
  Flex,
  Text,
  useFieldArray,
  useForm,
  useWizardContext,
} from '@disruptive-labs/ui';
import TrashIcon from '@disruptive-labs/ui/dist/icons/Trash';
import { forwardRef } from 'react';
import { WizardData } from './createJobDataTypes';

export const CustomStepResponsibilities = forwardRef((_, ref: any) => {
  const { next, data } = useWizardContext<WizardData>();

  const { submitForm, control, register, watch } = useForm({
    defaultValues: {
      responsibilities: !data.responsibilities?.length
        ? [{ value: '' }]
        : data.responsibilities.map((el) => ({ value: el })),
    },
    onSubmit: async ({ responsibilities }: { responsibilities: { value: string }[] }) => {
      await next({
        ...data,
        responsibilities: responsibilities.map((el) => el.value).filter((resp) => !!resp),
      });
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'responsibilities' });
  const watchFieldArray = watch('responsibilities');
  const controlledFields = fields.map((field, index) => ({
    ...field,
    ...watchFieldArray[index],
  }));

  return (
    <form onSubmit={submitForm}>
      <Flex textAlign="left" maxWidth={96} ml="auto" mr="auto">
        {controlledFields.map((responsibility, index) => (
          <Flex mb={3} key={responsibility.id}>
            <Flex mb={3} direction="row" justify="space-between">
              <Text fontWeight="700">{`Responsibility #${index + 1}`}</Text>
              {responsibility && responsibility.value !== '' && (
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
              id={responsibility.id}
              {...register(`responsibilities.${index}.value` as const)}
              type="text"
              multiline
              placeholder="E.g. Always be ready to assist customers with menu options and payment."
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
          disabled={!controlledFields[controlledFields.length - 1]?.value.length}
        >
          Add more
        </Button>
      </Flex>
      <Button colorScheme="primary" fluid type="submit" maxWidth={96} mt={8}>
        Save & Next
      </Button>
    </form>
  );
});
