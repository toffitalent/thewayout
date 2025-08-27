import {
  Button,
  FieldOptions,
  useForm,
  useWizardContext,
  WizardChoices,
  WizardChoicesGroup,
  WizardStep,
} from '@disruptive-labs/ui';
import ArrowNarrowRight from '@disruptive-labs/ui/dist/icons/ArrowNarrowRight';
import { selectAuthUser } from '@app/features/auth';
import { useAppSelector } from '@app/hooks';
import { WizardData } from '../../profileDataTypes';

export interface CustomStepReferredByProps extends Omit<Partial<WizardStep>, 'fields'> {
  fields?: {
    name: string;
    type: 'choices';
    label: string;
    placeholder: string;
    options: (FieldOptions | WizardChoicesGroup)[];
  }[];
}

export const CustomStepReferredBy = (props: CustomStepReferredByProps) => {
  const user = useAppSelector(selectAuthUser);
  const { next } = useWizardContext<WizardData>();

  const {
    submitForm,
    control,
    formState: { isDirty, isSubmitting },
  } = useForm({
    defaultValues: {
      referredBy: user?.client?.referredBy,
    },
    onSubmit: async ({ referredBy }) => {
      await next({ referredBy });
    },
  });

  const { fields } = props;
  if (!fields) {
    return null;
  }

  return (
    <form onSubmit={submitForm}>
      {fields.map((field) => (
        <WizardChoices key={field.name} {...field} control={control} />
      ))}
      <Button
        colorScheme="primary"
        fluid
        type="submit"
        maxWidth={96}
        mt={8}
        accessoryRight={<ArrowNarrowRight />}
        disabled={(!user?.client?.referredBy && !isDirty) || isSubmitting}
      >
        Submit
      </Button>
    </form>
  );
};
