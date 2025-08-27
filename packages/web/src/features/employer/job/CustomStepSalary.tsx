import {
  FieldComponentProps,
  FieldType,
  Flex,
  useWizardContext,
  WizardStep,
} from '@disruptive-labs/ui';
import { SalaryForm, SalaryWizardData } from './SalaryForm';

export interface CustomStepSalaryProps extends Omit<Partial<WizardStep>, 'fields'> {
  fields?: FieldComponentProps<FieldType>[];
}

export const CustomStepSalary = (props: CustomStepSalaryProps) => {
  const { next, data } = useWizardContext<SalaryWizardData>();

  const { fields } = props;
  if (!fields) {
    return null;
  }
  const [salaryField, minSalaryField, maxSalaryField, salaryDescriptionField] = fields;

  const handleSubmit = async (values: SalaryWizardData) => {
    await next(values);
  };

  return (
    <Flex maxWidth={96} ml="auto" mr="auto">
      <SalaryForm
        data={data}
        salaryField={salaryField}
        minSalaryField={minSalaryField}
        maxSalaryField={maxSalaryField}
        salaryDescriptionField={salaryDescriptionField}
        onSubmit={handleSubmit}
      />
    </Flex>
  );
};
