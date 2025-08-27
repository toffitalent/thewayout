import { Button, Flex, useForm, useWizardContext } from '@disruptive-labs/ui';
import { CustomStepTextField } from '@app/types';
import { formatPhoneNumber } from '@app/utils';
import { PhoneNumberInput } from '../PhoneNumberInput';

export const CustomStepPhone = (props: CustomStepTextField) => {
  const { data: wizardData, next } = useWizardContext<{ phone: string }>();

  const {
    submitForm,
    setValue,
    control,
    formState: { isValid },
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      phone: wizardData.phone ? formatPhoneNumber(wizardData.phone) : '',
    },
    onSubmit: async (data) => {
      await next({
        ...wizardData,
        phone: data.phone ? data.phone.replace(/[^0-9]/g, '') : undefined,
      });
    },
  });

  const { fields } = props;
  if (!fields) {
    return null;
  }
  const [phone] = fields;

  return (
    <Flex maxWidth={96} ml="auto" mr="auto">
      <form onSubmit={submitForm}>
        <PhoneNumberInput
          {...phone}
          control={control}
          fluid
          setPhoneValue={(value: string) => {
            setValue('phone', value, {
              shouldDirty: true,
              shouldValidate: value.length === 14 || value.length === 0,
            });
          }}
          isFieldsRequired={phone.validate?.required}
        />
        <Button colorScheme="primary" fluid type="submit" maxWidth={96} mt={8} disabled={!isValid}>
          Save & Next
        </Button>
      </form>
    </Flex>
  );
};
