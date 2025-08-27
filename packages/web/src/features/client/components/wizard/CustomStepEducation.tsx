import { useWizardContext, WizardStep } from '@disruptive-labs/ui';
import { Education } from '@two/shared';
import { StepsClient, WizardData } from '../../profileDataTypes';
import { ArrayStep } from './ArrayStep';

export const CustomStepEducation = (props: Partial<WizardStep>) => {
  const { data } = useWizardContext();
  const savedEducation = (data as WizardData).education || [];
  const { fields, nextStep } = props;
  if (!fields) {
    return null;
  }
  const getDates = (item: Education) =>
    `${item.startYear} ${item.yearEarned ? `- ${item.yearEarned}` : ''}`;

  return (
    <ArrayStep
      minimalItems={0}
      id={StepsClient.education}
      fields={fields}
      showListInEditMode={false}
      initialData={{
        schoolIssuer: '',
        degree: '',
        areaOfStudy: '',
        startYear: '',
        yearEarned: '',
        description: '',
      }}
      nextStep={nextStep}
      headerTitle={savedEducation.length ? 'How many degrees have you earned?' : 'Add education'}
      headerDescription={
        savedEducation.length
          ? 'Are there any additional degrees you would like to add?'
          : 'Please tell us about your educational degree(s)'
      }
      getListItemExtraContent={getDates}
      titleFieldName="schoolIssuer"
      text1FieldName="degree"
    />
  );
};
