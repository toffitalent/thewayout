import { ClientType, Education, License, RelativeExperience } from '@two/shared';
import { months } from '@app/data/months';

export const getDatesExperience = ({
  startAtMonth,
  startAtYear,
  endAtMonth,
  endAtYear,
}: Pick<RelativeExperience, 'startAtMonth' | 'startAtYear' | 'endAtMonth' | 'endAtYear'>) => {
  const startAt = `${months[startAtMonth]} ${startAtYear}`;
  const endAt = !!endAtMonth && !!endAtYear ? `${months[endAtMonth]} ${endAtYear}` : 'Present';
  return `${startAt} - ${endAt}`;
};

export const getDatesEducation = (item: Partial<Education>) =>
  `${item.startYear}${item.yearEarned ? ` - ${item.yearEarned}` : ''}`;

export const getDatesLicense = ({
  issueAtMonth,
  issueAtYear,
  expirationAtMonth,
  expirationAtYear,
}: Partial<License>) =>
  `${issueAtMonth ? `${months[issueAtMonth]} ` : ''}${issueAtYear}${
    expirationAtMonth || expirationAtYear ? ' - ' : ''
  }${expirationAtMonth ? `${months[expirationAtMonth]} ` : ''}${expirationAtYear || ''}`;

export const getDatesVeteranForm = ({
  veteranStartAt,
  veteranEndAt,
}: Pick<ClientType, 'veteranStartAt' | 'veteranEndAt'>): {
  veteranStartAtMonth: string;
  veteranStartAtYear: string;
  veteranEndAtMonth: string;
  veteranEndAtYear: string;
} => ({
  veteranStartAtMonth: veteranStartAt?.split('-')[1].replace(/^0+/, '') || '',
  veteranStartAtYear: veteranStartAt?.split('-')[0] || '',
  veteranEndAtMonth: veteranEndAt?.split('-')[1].replace(/^0+/, '') || '',
  veteranEndAtYear: veteranEndAt?.split('-')[0] || '',
});
