import { JobSalaries } from '@two/shared';
import { formatInUsdCurrency, formatSalaryRange } from '../formatSalary';

describe('formatSalary', () => {
  test('formatInUsdCurrency - formats salary correctly', () => {
    expect(formatInUsdCurrency('40')).toBe('$40');
    expect(formatInUsdCurrency('4000')).toBe('$4,000');
  });

  test('formatSalaryRange - formats salary range correctly', () => {
    expect(formatSalaryRange('40', '50', JobSalaries.hourly)).toBe('$40 - $50/hour');
    expect(formatSalaryRange('40', '40', JobSalaries.hourly)).toBe('$40/hour');
    expect(formatSalaryRange('1500', '1500', JobSalaries.yearly)).toBe('$1,500/year');
    expect(formatSalaryRange('1500', '2000', JobSalaries.yearly)).toBe('$1,500 - $2,000/year');
  });
});
