import { Text, useWizardContext } from '@disruptive-labs/ui';
import type { WizardRspData } from './rspData';

export const CustomStepOffensesDescription = () => {
  const {
    data: { name },
  } = useWizardContext<WizardRspData>();

  return (
    <Text
      mt={3}
    >{`We will only recommend ${name} to candidates that meet your allowable offenses (per State and Federal statutes).`}</Text>
  );
};
