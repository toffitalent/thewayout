import { Button, Field, useForm } from '@disruptive-labs/ui';
import { PhoneNumberInput } from '@app/components/PhoneNumberInput';
import styles from './CaseManagerForm.module.scss';

export interface CaseManagerFormFields {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

interface CaseManagerFormProps {
  defaultValues: CaseManagerFormFields;
  buttonLabel: string;
  isFieldsRequired?: boolean;
  onSubmit: (values: CaseManagerFormFields) => void;
}

export const CaseManagerForm = ({
  defaultValues,
  buttonLabel,
  isFieldsRequired,
  onSubmit,
}: CaseManagerFormProps) => {
  const {
    submitForm,
    control,
    setValue,
    formState: { isValid, isDirty },
  } = useForm({
    defaultValues,
    onSubmit,
  });

  return (
    <form onSubmit={submitForm} className={styles.formWrapper}>
      <Field
        type="text"
        name="firstName"
        label="First Name"
        placeholder="First Name"
        control={control}
        width="1/2"
        display="inline-block"
        fluid
        pr={1}
        validate={{ required: isFieldsRequired }}
      />
      <Field
        type="text"
        name="lastName"
        label="Last Name"
        placeholder="Last Name"
        control={control}
        width="1/2"
        display="inline-block"
        fluid
        pl={1}
        mt={0}
        validate={{ required: isFieldsRequired }}
      />
      <Field
        type="email"
        name="email"
        label="Email"
        placeholder="Email"
        control={control}
        width="1/2"
        display="inline-block"
        fluid
        pr={1}
        validate={{ required: isFieldsRequired }}
      />
      <PhoneNumberInput
        name="phone"
        label="Phone"
        placeholder="Phone"
        width="1/2"
        display="inline-block"
        fluid
        pl={1}
        isFieldsRequired={isFieldsRequired || true}
        control={control}
        setPhoneValue={(value: string) => {
          setValue('phone', value, {
            shouldDirty: true,
            shouldValidate: value.length === 14,
          });
        }}
      />
      <Button colorScheme="primary" type="submit" mt={8} disabled={!isValid || !isDirty}>
        {buttonLabel}
      </Button>
    </form>
  );
};
