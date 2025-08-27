import { useWizardContext, WizardStep } from '@disruptive-labs/ui';
import { RelativeExperience } from '@two/shared';
import { months } from '@app/data/months';
import { StepsClient, WizardData } from '../../profileDataTypes';
import { ArrayStep } from './ArrayStep';

export const CustomStepExperience = (props: Partial<WizardStep>) => {
  const { data } = useWizardContext<WizardData>();
  const savedRelativeExperience = data.relativeExperience || [];
  const { fields, nextStep } = props;
  if (!fields) {
    return null;
  }

  const getDates = ({ startAtMonth, startAtYear, endAtMonth, endAtYear }: RelativeExperience) => {
    const startAt = `${months[startAtMonth]} ${startAtYear}`;
    const endAt = !!endAtMonth && !!endAtYear ? `${months[endAtMonth]} ${endAtYear}` : 'Present';
    return `${startAt} - ${endAt}`;
  };

  return (
    <ArrayStep
      minimalItems={0}
      id={StepsClient.relativeExperience}
      fields={fields}
      showListInEditMode={false}
      initialData={{
        title: '',
        company: '',
        startAtMonth: '',
        startAtYear: '',
        endAtMonth: '',
        endAtYear: '',
        location: '',
        description: '',
        stillWork: false,
      }}
      nextStep={nextStep}
      headerTitle={
        savedRelativeExperience.length
          ? 'Great, keep adding to your experience!'
          : 'Add relative experience'
      }
      headerDescription={
        savedRelativeExperience.length
          ? 'Are there any additional positions / skills you would like to add?'
          : 'Consider adding your work history, life experiences, or other relative experiences that can be utilized in the workplace'
      }
      getListItemExtraContent={getDates}
      titleFieldName="title"
      text1FieldName="company"
    />
  );
};
