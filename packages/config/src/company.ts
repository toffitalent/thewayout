import { register } from '@disruptive-labs/config';

export const company = register('company', () => ({
  name: 'The Way Out',
  legalName: 'The Way Out, Inc.',
  shortName: 'TWO',
  description:
    'The Way Out is a comprehensive anti-bias job platform, that aligns employers with qualified Justice Involved Job Seekers (JIJS).',
  colorPrimary: '#4C51BF',

  // Email
  emailFromAddress: 'support@thewayouthelps.com',
  emailFromName: 'The Way Out',
  supportEmail: 'support@thewayouthelps.com',

  // Address
  address: 'PO Box 70620',
  city: 'Milwaukee',
  region: 'WI',
  postalCode: '53207',

  // Social media
  facebookUrl: '',
  instagramUrl: '',
  linkedInUrl: '',
  twitterUrl: '',
  youtubeUrl: '',
}));
