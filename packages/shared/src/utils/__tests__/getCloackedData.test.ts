import { getCloakedData, getCloakedEmail, getFullyCloakedData } from '../getCloakedData';

describe('getCloakedData', () => {
  test('returns valid cloaked data', () => {
    expect(getCloakedData('Test')).toBe('T****');
  });
});

describe('getFullyCloakedData', () => {
  test('returns valid cloaked data', () => {
    expect(getFullyCloakedData()).toBe('*****');
  });
});

describe('getCloakedEmail', () => {
  test('returns valid cloaked data', () => {
    expect(getCloakedEmail('test@email.com')).toBe('t****@*****.***');
  });
});
