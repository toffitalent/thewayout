import { offenseCategories, OffenseCategoryType } from '@two/shared';

export const noOffensesBadge = (offensesTypes: OffenseCategoryType[]) =>
  Object.values(OffenseCategoryType)
    .filter((el) => !offensesTypes.includes(el))
    .map((offense) => `NO ${offenseCategories[offense].name.toUpperCase()} OFFENSES`);
