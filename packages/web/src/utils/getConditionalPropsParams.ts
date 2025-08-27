import { AvailableKeys, CustomWizardField } from '@app/features/client/profileDataTypes';

export const getConditionalPropsParams = (fields: CustomWizardField[]) => {
  const fieldsWithConditionalProps = fields.filter((field) => field.conditionalPropsParams);
  const conditionalPropsParams = fieldsWithConditionalProps.flatMap(
    (el) => el.conditionalPropsParams,
  ) as AvailableKeys[];
  return conditionalPropsParams.length ? Array.from(new Set(conditionalPropsParams)) : [];
};
