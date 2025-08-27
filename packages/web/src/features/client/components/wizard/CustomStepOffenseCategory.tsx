import {
  Button,
  FieldOptions,
  useForm,
  useWizardContext,
  WizardChoices,
  WizardChoicesGroup,
  WizardStep,
} from '@disruptive-labs/ui';
import { WizardData } from '../../profileDataTypes';

export interface CustomStepOffenseCategoryProps extends Omit<Partial<WizardStep>, 'fields'> {
  fields?: {
    name: string;
    type: 'choices';
    label: string;
    placeholder: string;
    options: (FieldOptions | WizardChoicesGroup)[];
  }[];
}

export const CustomStepOffenseCategory = (props: CustomStepOffenseCategoryProps) => {
  const { data: wizardData, next } = useWizardContext<WizardData>();

  const {
    offenseDrugs,
    offensePropertyDamage,
    offenseSexual,
    offenseTheft,
    offenseViolent,
    offenseWhiteCollar,
    offenseMotorVehicle,
    sexualOffenderRegistry,
    sbn,
  } = wizardData;

  const handleSave = async (
    data: Pick<
      WizardData,
      | 'offenseDrugs'
      | 'offensePropertyDamage'
      | 'offenseSexual'
      | 'offenseTheft'
      | 'offenseViolent'
      | 'offenseWhiteCollar'
      | 'offenseMotorVehicle'
    >,
  ) => {
    await next({
      ...wizardData,
      offenseDrugs: data.offenseDrugs,
      offensePropertyDamage: data.offensePropertyDamage,
      offenseSexual: data.offenseSexual,
      offenseTheft: data.offenseTheft,
      offenseViolent: data.offenseViolent,
      offenseWhiteCollar: data.offenseWhiteCollar,
      offenseMotorVehicle: data.offenseMotorVehicle,
      ...(!data.offenseSexual.length && sexualOffenderRegistry && { sexualOffenderRegistry: 'no' }),
      ...(!data.offenseSexual.length && sbn && { sbn: 'no' }),
    });
  };

  const {
    submitForm,
    getValues,
    control,
    formState: { isValid },
  } = useForm({
    defaultValues: {
      offenseDrugs: offenseDrugs || [],
      offensePropertyDamage: offensePropertyDamage || [],
      offenseSexual: offenseSexual || [],
      offenseTheft: offenseTheft || [],
      offenseViolent: offenseViolent || [],
      offenseWhiteCollar: offenseWhiteCollar || [],
      offenseMotorVehicle: offenseMotorVehicle || [],
    },
    onSubmit: handleSave,
  });

  const { fields } = props;
  if (!fields) {
    return null;
  }

  const validate = () =>
    Object.values(getValues()).find((el) => el.length !== 0) ? undefined : ' ';

  return (
    <form onSubmit={submitForm}>
      {fields.map((field) => (
        <WizardChoices key={field.name} {...field} control={control} validate={{ validate }} />
      ))}
      <Button colorScheme="primary" fluid type="submit" maxWidth={96} mt={8} disabled={!isValid}>
        Save & Next
      </Button>
    </form>
  );
};
