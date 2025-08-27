import { Button, Field, Flex, useForm, useWizardContext } from '@disruptive-labs/ui';
import { PhoneNumberInput } from '@app/components/PhoneNumberInput';
import { CustomStepTextField } from '@app/types';
import { formatPhoneNumber } from '@app/utils';
import type { WizardRspData } from './rspData';

export const CustomStepContact = (props: CustomStepTextField) => {
  const { data: wizardData, next } = useWizardContext<WizardRspData>();

  const {
    submitForm,
    setValue,
    control,
    formState: { isValid },
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      phoneRspContact: wizardData.phoneRspContact
        ? formatPhoneNumber(wizardData.phoneRspContact)
        : '',
      emailRspContact: wizardData.emailRspContact || '',
    },
    onSubmit: async (data) => {
      await next({
        ...wizardData,
        phoneRspContact: data.phoneRspContact
          ? data.phoneRspContact.replace(/[^0-9]/g, '')
          : undefined,
        emailRspContact: data.emailRspContact,
      });
    },
  });

  const { fields } = props;
  if (!fields) {
    return null;
  }
  const [phone, email] = fields;

  return (
    <Flex maxWidth={96} ml="auto" mr="auto">
      <form onSubmit={submitForm}>
        <PhoneNumberInput
          {...phone}
          control={control}
          fluid
          setPhoneValue={(value: string) => {
            setValue('phoneRspContact', value, {
              shouldDirty: true,
              shouldValidate: value.length === 14 || value.length === 0,
            });
          }}
          isFieldsRequired={phone.validate?.required}
        />
        <Field {...email} control={control} fluid />
        <Button colorScheme="primary" fluid type="submit" maxWidth={96} mt={8} disabled={!isValid}>
          Save & Next
        </Button>
      </form>
    </Flex>
  );
};
