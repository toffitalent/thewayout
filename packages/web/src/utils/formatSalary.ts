import { JobSalaries } from '@two/shared';

const salaryUnits = {
  [JobSalaries.hourly]: 'hour',
  [JobSalaries.yearly]: 'year',
};

export const formatInUsdCurrency = (salary: string) =>
  Number(getSalaryValue(salary)).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
  });

export const getSalaryValue = (num: string) => num.replace(/[^0-9]/g, '');

export const formatSalaryRange = (min: string, max: string, salaryUnit: JobSalaries) => {
  const isEqual = Number(getSalaryValue(max)) - Number(getSalaryValue(min)) === 0;
  return isEqual
    ? `${formatInUsdCurrency(min)}/${salaryUnits[salaryUnit]}`
    : `${formatInUsdCurrency(min)} - ${formatInUsdCurrency(max)}/${salaryUnits[salaryUnit]}`;
};
