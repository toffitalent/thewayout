import { WizardStep } from '@disruptive-labs/ui';
import { License } from '@two/shared';
import { months } from '@app/data/months';
import { StepsClient } from '../../profileDataTypes';
import { ArrayStep } from './ArrayStep';

export const CustomStepLicense = (props: Partial<WizardStep>) => {
  const { fields, nextStep } = props;
  if (!fields) {
    return null;
  }

  const getDates = ({ issueAtMonth, issueAtYear }: License) =>
    `Issued ${months[issueAtMonth]} ${issueAtYear}`;

  return (
    <ArrayStep
      minimalItems={0}
      id={StepsClient.license}
      fields={fields}
      showListInEditMode={false}
      initialData={{
        licenseName: '',
        issuingOrganization: '',
        issueAtMonth: '',
        issueAtYear: '',
        expirationAtMonth: '',
        expirationAtYear: '',
      }}
      nextStep={nextStep}
      getListItemExtraContent={getDates}
      titleFieldName="licenseName"
      text1FieldName="issuingOrganization"
    />
  );
};
