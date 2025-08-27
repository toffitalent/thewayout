export enum OffenseCategory {
  possession = 'possession',
  distribution = 'distribution',
  sexualAssault = 'sexualAssault',
  statutoryRape = 'statutoryRape',
  pornography = 'pornography',
  homicide = 'homicide',
  manslaughter = 'manslaughter',
  recklessEndangerment = 'recklessEndangerment',
  robbery = 'robbery',
  identityTheft = 'identityTheft',
  burglary = 'burglary',
  vandalism = 'vandalism',
  arson = 'arson',
  fraud = 'fraud',
  embezzlement = 'embezzlement',
  moneyLaundering = 'moneyLaundering',
  diuDwi = 'diuDwi',
  hitAndRun = 'hitAndRun',
  fleeingPolice = 'fleeingPolice',
  vehicularManslaughter = 'vehicularManslaughter',
  vehicularHomicide = 'vehicularHomicide',
  domesticViolence = 'domesticViolence',
  battery = 'battery',
  bailJumping = 'bailJumping',
}

export enum OffenseCategoryType {
  drugs = 'drugs',
  motorVehicle = 'motorVehicle',
  sexual = 'sexual',
  violent = 'violent',
  theft = 'theft',
  propertyDamage = 'propertyDamage',
  whiteCollar = 'whiteCollar',
}

type OffenseCategories = {
  [key in OffenseCategoryType]: {
    name: string;
    categories: OffenseCategory[];
  };
};

export const offenseCategories: OffenseCategories = {
  [OffenseCategoryType.drugs]: {
    name: 'Drugs',
    categories: [OffenseCategory.distribution, OffenseCategory.possession],
  },
  [OffenseCategoryType.motorVehicle]: {
    name: 'Motor Vehicle',
    categories: [
      OffenseCategory.diuDwi,
      OffenseCategory.fleeingPolice,
      OffenseCategory.hitAndRun,
      OffenseCategory.vehicularHomicide,
      OffenseCategory.vehicularManslaughter,
    ],
  },
  [OffenseCategoryType.sexual]: {
    name: 'Sexual',
    categories: [
      OffenseCategory.pornography,
      OffenseCategory.sexualAssault,
      OffenseCategory.statutoryRape,
    ],
  },
  [OffenseCategoryType.violent]: {
    name: 'Violent',
    categories: [
      OffenseCategory.battery,
      OffenseCategory.domesticViolence,
      OffenseCategory.homicide,
      OffenseCategory.manslaughter,
      OffenseCategory.recklessEndangerment,
    ],
  },
  [OffenseCategoryType.theft]: {
    name: 'Theft',
    categories: [OffenseCategory.burglary, OffenseCategory.identityTheft, OffenseCategory.robbery],
  },
  [OffenseCategoryType.propertyDamage]: {
    name: 'Property Damage',
    categories: [OffenseCategory.arson, OffenseCategory.vandalism],
  },
  [OffenseCategoryType.whiteCollar]: {
    name: 'White - collar',
    categories: [
      OffenseCategory.bailJumping,
      OffenseCategory.embezzlement,
      OffenseCategory.fraud,
      OffenseCategory.moneyLaundering,
    ],
  },
};

export const offenseText: { [key in OffenseCategory]: string } = {
  [OffenseCategory.possession]: 'Possession',
  [OffenseCategory.distribution]: 'Distribution',
  [OffenseCategory.sexualAssault]: 'Sexual Assault ',
  [OffenseCategory.statutoryRape]: 'Statutory Rape',
  [OffenseCategory.pornography]: 'Pornography',
  [OffenseCategory.homicide]: 'Homicide',
  [OffenseCategory.manslaughter]: 'Manslaughter',
  [OffenseCategory.recklessEndangerment]: 'Reckless Endangerment',
  [OffenseCategory.robbery]: 'Robbery',
  [OffenseCategory.identityTheft]: 'Identity Theft',
  [OffenseCategory.burglary]: 'Burglary',
  [OffenseCategory.vandalism]: 'Vandalism',
  [OffenseCategory.arson]: 'Arson',
  [OffenseCategory.fraud]: 'Fraud ',
  [OffenseCategory.embezzlement]: 'Embezzlement',
  [OffenseCategory.moneyLaundering]: 'Money-Laundering',
  [OffenseCategory.diuDwi]: 'DUI and/or DWI',
  [OffenseCategory.hitAndRun]: 'Hit & Run',
  [OffenseCategory.fleeingPolice]: 'Fleeing Police',
  [OffenseCategory.vehicularManslaughter]: 'Vehicular Manslaughter',
  [OffenseCategory.vehicularHomicide]: 'Vehicular Homicide',
  [OffenseCategory.domesticViolence]: 'Domestic Violence',
  [OffenseCategory.battery]: 'Battery',
  [OffenseCategory.bailJumping]: 'Bail Jumping',
};

export interface OffenseWizardType {
  offenseDrugs: (OffenseCategory.possession | OffenseCategory.distribution)[];
  offensePropertyDamage: (OffenseCategory.vandalism | OffenseCategory.arson)[];
  offenseSexual: (
    | OffenseCategory.sexualAssault
    | OffenseCategory.statutoryRape
    | OffenseCategory.pornography
  )[];
  offenseTheft: (
    | OffenseCategory.robbery
    | OffenseCategory.identityTheft
    | OffenseCategory.burglary
  )[];
  offenseViolent: (
    | OffenseCategory.homicide
    | OffenseCategory.manslaughter
    | OffenseCategory.recklessEndangerment
    | OffenseCategory.domesticViolence
    | OffenseCategory.battery
  )[];
  offenseWhiteCollar: (
    | OffenseCategory.fraud
    | OffenseCategory.embezzlement
    | OffenseCategory.moneyLaundering
    | OffenseCategory.bailJumping
  )[];
  offenseMotorVehicle: (
    | OffenseCategory.diuDwi
    | OffenseCategory.hitAndRun
    | OffenseCategory.fleeingPolice
    | OffenseCategory.vehicularManslaughter
    | OffenseCategory.vehicularHomicide
  )[];
}
