import { Control, Input, InputProps } from '@disruptive-labs/ui';
import { ChangeEvent } from 'react';
import { Controller } from 'react-hook-form';
import { useFormattedPhoneNumber } from '@app/hooks';

interface PhoneNumberInputProps extends InputProps {
  isFieldsRequired?: boolean;
  control: Control<any, any>;
  setPhoneValue: (value: string) => void;
}

export const PhoneNumberInput = ({
  isFieldsRequired = false,
  control,
  setPhoneValue,
  ...props
}: PhoneNumberInputProps) => {
  const { formatNumber, parsePhoneNumber } = useFormattedPhoneNumber();
  const isFormattedNumber = !!formatNumber && !!parsePhoneNumber;

  const validatePhone = (phone: string) => {
    if (phone.replace(/[^0-9]/g, '').length === 10) {
      const phoneNumber = parsePhoneNumber!(phone, 'US');
      if (phoneNumber) {
        return phoneNumber.isValid() ? undefined : 'Invalid phone number';
      }
    }
    if (phone.length !== 14 && phone.length !== 0) {
      return 'Invalid phone number';
    }
    return undefined;
  };

  return (
    <Controller
      name={props.name || 'phone'}
      rules={{
        ...(isFormattedNumber && { validate: validatePhone }),
        required: isFieldsRequired,
      }}
      control={control}
      render={({ field: { onBlur, value, ref }, fieldState: { error, invalid } }) => (
        <Input
          {...props}
          type="text"
          invalid={invalid}
          onBlur={onBlur}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            if (isFormattedNumber) {
              formatNumber.reset();
              setPhoneValue(formatNumber.input(e.target.value));
            } else {
              setPhoneValue(e.target.value);
            }
          }}
          ref={ref}
          value={value}
          helperText={error?.message}
          maxLength={isFormattedNumber ? 14 : 10}
        />
      )}
    />
  );
};
