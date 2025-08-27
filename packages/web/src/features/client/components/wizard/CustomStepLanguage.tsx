import { WizardStep } from '@disruptive-labs/ui';
import { StepsClient } from '../../profileDataTypes';
import { ArrayStep } from './ArrayStep';

export const CustomStepLanguage = (props: Partial<WizardStep>) => {
  const { fields, nextStep } = props;
  if (!fields) {
    return null;
  }

  return (
    <ArrayStep
      minimalItems={0}
      id={StepsClient.languages}
      fields={fields}
      showListInEditMode={false}
      initialData={{ language: '', level: '' }}
      nextStep={nextStep}
      titleFieldName="language"
      text1FieldName="level"
    />
  );
};
