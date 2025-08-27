import {
  getDatesEducation,
  getDatesExperience,
  getDatesLicense,
  getDatesVeteranForm,
} from '../getDatesClientProfile';

describe('getDatesExperience', () => {
  test('returns dates for experience', () => {
    expect(
      getDatesExperience({
        startAtMonth: '5',
        startAtYear: '2015',
        endAtMonth: '6',
        endAtYear: '2020',
      }),
    ).toBe('May 2015 - June 2020');
    expect(
      getDatesExperience({
        startAtMonth: '5',
        startAtYear: '2015',
        endAtMonth: null,
        endAtYear: null,
      }),
    ).toBe('May 2015 - Present');
  });
});

describe('getDatesEducation', () => {
  test('returns dates for education', () => {
    expect(getDatesEducation({ startYear: '2010', yearEarned: '2015' })).toBe('2010 - 2015');
    expect(getDatesEducation({ startYear: '2010' })).toBe('2010');
  });
});

describe('getDatesLicense', () => {
  test('returns dates for license', () => {
    expect(
      getDatesLicense({
        issueAtMonth: '4',
        issueAtYear: '2012',
        expirationAtMonth: '10',
        expirationAtYear: '2018',
      }),
    ).toBe('Apr. 2012 - Oct. 2018');
    expect(getDatesLicense({ issueAtMonth: '8', issueAtYear: '2012' })).toBe('Aug. 2012');
    expect(getDatesLicense({ issueAtYear: '2012', expirationAtYear: '2018' })).toBe('2012 - 2018');
    expect(getDatesLicense({ issueAtYear: '2012' })).toBe('2012');
  });
});

describe('getDatesVeteranForm', () => {
  test('return form dates for veteran', async () => {
    expect(
      getDatesVeteranForm({
        veteranStartAt: '2000-05-01',
        veteranEndAt: '2005-06-01',
      }),
    ).toStrictEqual({
      veteranStartAtMonth: '5',
      veteranStartAtYear: '2000',
      veteranEndAtMonth: '6',
      veteranEndAtYear: '2005',
    });

    expect(
      getDatesVeteranForm({
        veteranStartAt: '2008-01-01',
      }),
    ).toStrictEqual({
      veteranStartAtMonth: '1',
      veteranStartAtYear: '2008',
      veteranEndAtMonth: '',
      veteranEndAtYear: '',
    });
  });
});
