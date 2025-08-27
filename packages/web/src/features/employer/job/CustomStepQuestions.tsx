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

export const CustomStepQuestions = forwardRef((_, ref: any) => {
  const { next, data } = useWizardContext<WizardData>();

  const { submitForm, control, register, watch } = useForm({
    defaultValues: {
      questions: !data.questions?.length
        ? [{ value: '' }]
        : data.questions.map((el) => ({ value: el })),
    },
    onSubmit: async ({ questions }: { questions: { value: string }[] }) => {
      await next({
        ...data,
        questions: questions.map((el) => el.value).filter((question) => !!question),
      });
    },
  });
  const { fields, append, remove } = useFieldArray({ control, name: 'questions' });
  const watchFieldArray = watch('questions');
  const controlledFields = fields.map((field, index) => ({
    ...field,
    ...watchFieldArray[index],
  }));

  return (
    <form onSubmit={submitForm}>
      <Flex textAlign="left" maxWidth={96} ml="auto" mr="auto">
        {controlledFields.map((question, index) => (
          <Flex mb={3} key={question.id}>
            <Flex direction="row" justify="space-between">
              <Text mb={3} fontWeight="700">{`Add question #${index + 1}`}</Text>
              {question && question.value !== '' && (
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
              id={question.id}
              {...register(`questions.${index}.value` as const)}
              type="text"
              multiline
              placeholder="E.g. Do you have a driver license?"
              value={question.value}
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
      <Button colorScheme="primary" fluid type="submit" maxWidth={96} mt={8}>
        Save & Next
      </Button>
    </form>
  );
});
