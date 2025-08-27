import { Button, Field, Flex, useForm, useWizardContext } from '@disruptive-labs/ui';
import { ChangeEvent } from 'react';
import { CustomStepTextField } from '@app/types';
import { WizardData } from '../../profileDataTypes';

export const CustomStepPersonalSummary = (props: CustomStepTextField) => {
  const { data, next } = useWizardContext<WizardData>();

  const { submitForm, setValue, control } = useForm({
    defaultValues: { personalSummary: data.personalSummary },
    onSubmit: async ({ personalSummary }: Pick<WizardData, 'personalSummary'>) => {
      await next({
        ...data,
        personalSummary,
      });
    },
  });

  const { fields } = props;
  if (!fields) {
    return null;
  }
  const [personalSummary] = fields;

  return (
    <Flex maxWidth={96} ml="auto" mr="auto">
      <form onSubmit={submitForm}>
        <Field
          {...personalSummary}
          fluid
          onCanPlayCapture={(e: ChangeEvent<HTMLInputElement>) => {
            setValue('personalSummary', e.target.value);
          }}
          control={control}
        />
        <Flex direction="row" justifyContent="center" mt={8}>
          <Button colorScheme="primary" variant="text" ph={5} onClick={() => next()}>
            Skip
          </Button>
          <Button colorScheme="primary" fluid type="submit" maxWidth={96}>
            Save & Next
          </Button>
        </Flex>
      </form>
    </Flex>
  );
};
