export enum Gender {
  female = 'female',
  male = 'male',
  nonBinary = 'nonBinary',
  genderFluid = 'genderFluid',
  intersex = 'intersex',
  transgender = 'transgender',
  preferNotToSay = 'preferNotToSay',
}

export enum Orientation {
  gay = 'gay',
  queer = 'queer',
  heterosexual = 'heterosexual',
  bisexual = 'bisexual',
  lesbian = 'lesbian',
}

export enum Religion {
  christianity = 'christianity',
  hinduism = 'hinduism',
  islam = 'islam',
  judaism = 'judaism',
  rastafarianism = 'rastafarianism',
  sikhism = 'sikhism',
  taoism = 'taoism',
  buddhism = 'buddhism',
  agnostic = 'agnostic',
  other = 'otherReligion',
  noReligion = 'noReligion',
}

export enum MaritalStatus {
  single = 'single',
  married = 'married',
  widowed = 'widowed',
  divorced = 'divorced',
  separated = 'separated',
  domesticPartnership = 'domesticPartnership',
}

export enum Age {
  '16-24' = '16-24',
  '25-34' = '25-34',
  '35-44' = '35-44',
  '45-54' = '45-54',
  '55-64' = '55-64',
  '65+' = '65+',
}

export enum Ethnicity {
  blackAfricanAmerican = 'blackAfricanAmerican',
  blackAfricanAmericanWhite = 'blackAfricanAmericanWhite',
  blackAfricanAmericanLatinxHispanic = 'blackAfricanAmericanLatinxHispanic',
  blackAfricanAmericanNativeAmericanIndigenous = 'blackAfricanAmericanNativeAmericanIndigenous',
  blackAfricanAmericanPacificIslander = 'blackAfricanAmericanPacificIslander',
  blackAfricanAmericanEastAsian = 'blackAfricanAmericanEastAsian',
  blackAfricanAmericanSoutheastAsian = 'blackAfricanAmericanSoutheastAsian',
  blackAfricanAmericanSouthAsian = 'blackAfricanAmericanSouthAsian',

  white = 'white',
  whiteLatinxHispanic = 'whiteLatinxHispanic',
  whiteNativeAmericanIndigenous = 'whiteNativeAmericanIndigenous',
  whitePacificIslander = 'whitePacificIslander',
  whiteEastAsian = 'whiteEastAsian',
  whiteSoutheastAsian = 'whiteSoutheastAsian',
  whiteSouthAsian = 'whiteSouthAsian',
  whiteBlackAfricanAmerican = 'whiteBlackAfricanAmerican',

  latinxHispanic = 'latinxHispanic',
  latinxHispanicBlack = 'latinxHispanicBlack',
  latinxHispanicWhite = 'latinxHispanicWhite',
  latinxHispanicNativeAmericanIndigenous = 'latinxHispanicNativeAmericanIndigenous',
  latinxHispanicPacificIslander = 'latinxHispanicPacificIslander',
  latinxHispanicEastAsian = 'latinxHispanicEastAsian',
  latinxHispanicSoutheastAsian = 'latinxHispanicSoutheastAsian',
  latinxHispanicSouthAsian = 'latinxHispanicSouthAsian',

  eastAsian = 'eastAsian',
  eastAsianBlack = 'eastAsianBlack',
  eastAsianLatinxHispanic = 'eastAsianLatinxHispanic',
  eastAsianWhite = 'eastAsianWhite',
  eastAsianNativeAmericanIndigenous = 'eastAsianNativeAmericanIndigenous',
  eastAsianPacificIslander = 'eastAsianPacificIslander',
  eastAsianSoutheastAsian = 'eastAsianSoutheastAsian',
  eastAsianSouthAsian = 'eastAsianSouthAsian',

  nativeAmericanIndigenous = 'nativeAmericanIndigenous',
  nativeAmericanIndigenousBlackAfricanAmerican = 'nativeAmericanIndigenousBlackAfricanAmerican',
  nativeAmericanIndigenousLatinxHispanic = 'nativeAmericanIndigenousLatinxHispanic',
  nativeAmericanIndigenousWhite = 'nativeAmericanIndigenousWhite',
  nativeAmericanIndigenousPacificIslander = 'nativeAmericanIndigenousPacificIslander',
  nativeAmericanIndigenousEastAsian = 'nativeAmericanIndigenousEastAsian',
  nativeAmericanIndigenousSoutheastAsian = 'nativeAmericanIndigenousSoutheastAsian',
  nativeAmericanIndigenousSouthAsian = 'nativeAmericanIndigenousSouthAsian',

  pacificIslander = 'pacificIslander',
  pacificIslanderBlackAfricanAmerican = 'pacificIslanderBlackAfricanAmerican',
  pacificIslanderLatinxHispanic = 'pacificIslanderLatinxHispanic',
  pacificIslanderWhite = 'pacificIslanderWhite',
  pacificIslanderNativeAmericanIndigenous = 'pacificIslanderNativeAmericanIndigenous',
  pacificIslanderEastAsian = 'pacificIslanderEastAsian',
  pacificIslanderSoutheastAsian = 'pacificIslanderSoutheastAsian',
  pacificIslanderSouthAsian = 'pacificIslanderSouthAsian',

  southAsian = 'southAsian',
  southAsianBlackAfricanAmerican = 'southAsianBlackAfricanAmerican',
  southAsianLatinxHispanic = 'southAsianLatinxHispanic',
  southAsianWhite = 'southAsianWhite',
  southAsianNativeAmericanIndigenous = 'southAsianNativeAmericanIndigenous',
  southAsianPacificIslander = 'southAsianPacificIslander',
  southAsianEastAsian = 'southAsianEastAsian',
  southAsianSoutheastAsian = 'southAsianSoutheastAsian',

  southeastAsian = 'southeastAsian',
  southeastAsianBlackAfricanAmerican = 'southeastAsianBlackAfricanAmerican',
  southeastAsianLatinxHispanic = 'southeastAsianLatinxHispanic',
  southeastAsianWhite = 'southeastAsianWhite',
  southeastAsianNativeAmericanIndigenous = 'southeastAsianNativeAmericanIndigenous',
  southeastAsianPacificIslander = 'southeastAsianPacificIslander',
  southeastAsianEastAsian = 'southeastAsianEastAsian',
  southeastAsianSouthAsian = 'southeastAsianSouthAsian',
}

export enum VeteranStatus {
  active = 'active',
  medal = 'medal',
  disabled = 'disabled',
  protectedNotIdentify = 'protectedNotIdentify',
  protected = 'protected',
  notVeteran = 'notVeteran',
  notIdentify = 'notIdentify',
  recentlySeparated = 'recentlySeparated',
}

export enum ReferredBy {
  caseManagerServicesProvider = 'caseManagerServicesProvider',
  probationParoleOfficerSocialWorker = 'probationParoleOfficerSocialWorker',
  newsletter = 'newsletter',
  socialMedia = 'socialMedia',
  newsMedia = 'newsMedia',
  familyFriends = 'familyFriends',
  other = 'other',
}

export enum PersonalStrengths {
  communicatesWell = 'communicatesWell',
  willingToLearn = 'willingToLearn',
  notAfraidOfRejection = 'notAfraidOfRejection',
  worksWellWithOthers = 'worksWellWithOthers',
  dealsWellWithChange = 'dealsWellWithChange',
  writesWell = 'writesWell',
  readWell = 'readWell',
  peoplePerson = 'peoplePerson',
  creative = 'creative',
  problemSolver = 'problemSolver',
  leadsByExample = 'leadsByExample',
  goodWithTechnology = 'goodWithTechnology',
  managesTimeWell = 'managesTimeWell',
  positiveAttitude = 'positiveAttitude',
  personalAwareness = 'personalAwareness',
  reliable = 'reliable',
  hardWorking = 'hardWorking',
  detailOriented = 'detailOriented',
  punctual = 'punctual',
  trustworthyHonest = 'trustworthyHonest',
}

export enum ExperienceSkills {
  construction = 'construction',
  retail = 'retail',
  hospitality = 'hospitality',
  landscaping = 'landscaping',
  deliveryDriver = 'deliveryDriver',
  truckDriver = 'truckDriver',
  warehouse = 'warehouse',
  carpentry = 'carpentry',
  technology = 'technology',
  generalLabor = 'generalLabor',
  salesMarketing = 'salesMarketing',
  janitorial = 'janitorial',
  electrician = 'electrician',
  welding = 'welding',
  plumbing = 'plumbing',
  finance = 'finance',
  education = 'education',
  entertainment = 'entertainment',
  healthcare = 'healthcare',
  manufacturing = 'manufacturing',
  operations = 'operations',
  engineering = 'engineering',
  customerService = 'customerService',
  cncRobotics = 'cncRobotics',
  nursing = 'nursing',
  publicService = 'publicService',
  military = 'military',
}

export enum Language {
  english = 'english',
  spanish = 'spanish',
  french = 'french',
  chinese = 'chinese',
  german = 'german',
  russian = 'russian',
  vietnamese = 'vietnamese',
  tagalog = 'tagalog',
  arabic = 'arabic',
  korean = 'korean',
}

export enum LanguageLevel {
  elementary = 'elementary',
  basic = 'basic',
  professional = 'professional',
  nativeBilingual = 'nativeBilingual',
}

export enum TimeServed {
  timeServed01 = 'timeServed01',
  timeServed12 = 'timeServed12',
  timeServed25 = 'timeServed25',
  timeServed57 = 'timeServed57',
  timeServed710 = 'timeServed710',
  timeServed1020 = 'timeServed1020',
  'timeServed20+' = 'timeServed20+',
  noTimeServed = 'noTimeServed',
}

export enum ReleasedAt {
  releasedAt01 = 'releasedAt01',
  releasedAt12 = 'releasedAt12',
  releasedAt23 = 'releasedAt23',
  releasedAt35 = 'releasedAt35',
  releasedAt510 = 'releasedAt510',
  'releasedAt10+' = 'releasedAt10+',
  notCompleted = 'notCompleted',
}

export enum StateFederal {
  state = 'state',
  federal = 'federal',
  both = 'both',
}

export enum VeteranOrJustice {
  veteran = 'veteran',
  justiceImpacted = 'justiceImpacted',
}
