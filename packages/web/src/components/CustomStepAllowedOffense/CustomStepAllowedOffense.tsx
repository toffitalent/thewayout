import {
  Button,
  FieldOptions,
  Flex,
  useForm,
  useWizardContext,
  WizardChoices,
  WizardChoicesGroup,
  WizardStep,
} from '@disruptive-labs/ui';
import { OffenseWizardType } from '@two/shared';
import { allOffenses, emptyOffenses } from '@app/utils/getWizardOffense';

interface FieldsOffense {
  name: string;
  type: 'choices';
  label: string;
  placeholder?: string;
  options: (FieldOptions | WizardChoicesGroup)[];
}

export interface CustomStepOffenseCategoryProps extends Omit<Partial<WizardStep>, 'fields'> {
  fields?: FieldsOffense[];
  isRequired?: boolean;
}

interface AllowedOffenseStepProps {
  defaultValues: OffenseWizardType;
  isRequired?: boolean;
  fields: FieldsOffense[];
  buttonLabel?: string;
  shouldReset?: boolean;
  onSubmit: (data: OffenseWizardType) => void;
}

export const AllowedOffenseForm = ({
  fields,
  defaultValues,
  isRequired,
  shouldReset,
  buttonLabel,
  onSubmit,
}: AllowedOffenseStepProps) => {
  const {
    submitForm,
    getValues,
    setValue,
    reset,
    control,
    formState: { isValid },
  } = useForm({
    defaultValues,
    onSubmit: (values) => {
      onSubmit(values);
      if (shouldReset) {
        reset(getValues());
      }
    },
  });

  const validate = () =>
    Object.values(getValues()).find((el) => el.length !== 0) ? undefined : ' ';

  return (
    <form onSubmit={submitForm}>
      <Flex justify="center" mb={5}>
        <Button
          variant="outline"
          onClick={() =>
            Object.entries(allOffenses).map(([key, value]) =>
              setValue(key as keyof OffenseWizardType, value, { shouldValidate: true }),
            )
          }
        >
          Select All
        </Button>
        <Button
          ph={6}
          variant="text"
          onClick={() =>
            Object.entries(emptyOffenses).map(([key, value]) =>
              setValue(key as keyof OffenseWizardType, value, { shouldValidate: true }),
            )
          }
        >
          Clear All
        </Button>
      </Flex>
      {fields.map((field) => (
        <WizardChoices key={field.name} {...field} control={control} validate={{ validate }} />
      ))}
      <Button
        colorScheme="primary"
        fluid
        type="submit"
        maxWidth={96}
        mt={8}
        disabled={isRequired ? !isValid : false}
      >
        {buttonLabel || 'Save & Next'}
      </Button>
    </form>
  );
};

export const CustomStepAllowedOffense = (props: CustomStepOffenseCategoryProps) => {
  const { data: wizardData, next } = useWizardContext<OffenseWizardType>();

  const {
    offenseDrugs,
    offensePropertyDamage,
    offenseSexual,
    offenseTheft,
    offenseViolent,
    offenseWhiteCollar,
    offenseMotorVehicle,
  } = wizardData;

  const handleSave = async (data: OffenseWizardType) => {
    await next({
      ...wizardData,
      offenseDrugs: data.offenseDrugs,
      offensePropertyDamage: data.offensePropertyDamage,
      offenseSexual: data.offenseSexual,
      offenseTheft: data.offenseTheft,
      offenseViolent: data.offenseViolent,
      offenseWhiteCollar: data.offenseWhiteCollar,
      offenseMotorVehicle: data.offenseMotorVehicle,
    });
  };

  const { fields, isRequired } = props;
  if (!fields) {
    return null;
  }

  return (
    <AllowedOffenseForm
      fields={fields}
      defaultValues={{
        offenseDrugs: offenseDrugs || [],
        offensePropertyDamage: offensePropertyDamage || [],
        offenseSexual: offenseSexual || [],
        offenseTheft: offenseTheft || [],
        offenseViolent: offenseViolent || [],
        offenseWhiteCollar: offenseWhiteCollar || [],
        offenseMotorVehicle: offenseMotorVehicle || [],
      }}
      onSubmit={handleSave}
      isRequired={isRequired}
    />
  );
};
