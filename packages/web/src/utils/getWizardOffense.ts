import { OffenseCategory as Offense, OffenseCategory, OffenseWizardType } from '@two/shared';

export const getWizardOffense = (offenses: Offense[]) => {
  const offenseDrugs: Offense[] = [];
  const offensePropertyDamage: Offense[] = [];
  const offenseSexual: Offense[] = [];
  const offenseTheft: Offense[] = [];
  const offenseViolent: Offense[] = [];
  const offenseWhiteCollar: Offense[] = [];
  const offenseMotorVehicle: Offense[] = [];

  const offenseDrugsTypes = [Offense.possession, Offense.distribution];
  const offensePropertyDamageTypes = [Offense.vandalism, Offense.arson];
  const offenseSexualTypes = [Offense.sexualAssault, Offense.statutoryRape, Offense.pornography];
  const offenseTheftTypes = [Offense.robbery, Offense.identityTheft, Offense.burglary];
  const offenseViolentTypes = [
    Offense.homicide,
    Offense.manslaughter,
    Offense.recklessEndangerment,
    Offense.domesticViolence,
    Offense.battery,
  ];
  const offenseWhiteCollarTypes = [
    Offense.fraud,
    Offense.embezzlement,
    Offense.moneyLaundering,
    Offense.bailJumping,
  ];
  const offenseMotorVehicleTypes = [
    Offense.diuDwi,
    Offense.hitAndRun,
    Offense.fleeingPolice,
    Offense.vehicularHomicide,
    Offense.vehicularManslaughter,
  ];

  offenses.forEach((offense) => {
    if (offenseDrugsTypes.includes(offense)) {
      offenseDrugs.push(offense);
    }
    if (offensePropertyDamageTypes.includes(offense)) {
      offensePropertyDamage.push(offense);
    }
    if (offenseSexualTypes.includes(offense)) {
      offenseSexual.push(offense);
    }
    if (offenseTheftTypes.includes(offense)) {
      offenseTheft.push(offense);
    }
    if (offenseViolentTypes.includes(offense)) {
      offenseViolent.push(offense);
    }
    if (offenseWhiteCollarTypes.includes(offense)) {
      offenseWhiteCollar.push(offense);
    }
    if (offenseMotorVehicleTypes.includes(offense)) {
      offenseMotorVehicle.push(offense);
    }
  });

  return {
    offenseDrugs,
    offensePropertyDamage,
    offenseSexual,
    offenseTheft,
    offenseViolent,
    offenseWhiteCollar,
    offenseMotorVehicle,
  } as OffenseWizardType;
};

export const allOffenses = {
  offenseDrugs: [OffenseCategory.possession, OffenseCategory.distribution] as (
    | Offense.possession
    | Offense.distribution
  )[],
  offensePropertyDamage: [OffenseCategory.vandalism, OffenseCategory.arson],
  offenseSexual: [
    OffenseCategory.sexualAssault,
    OffenseCategory.statutoryRape,
    OffenseCategory.pornography,
  ],
  offenseTheft: [OffenseCategory.robbery, OffenseCategory.identityTheft, OffenseCategory.burglary],
  offenseViolent: [
    OffenseCategory.homicide,
    OffenseCategory.manslaughter,
    OffenseCategory.recklessEndangerment,
    OffenseCategory.domesticViolence,
    OffenseCategory.battery,
  ],
  offenseWhiteCollar: [
    OffenseCategory.fraud,
    OffenseCategory.embezzlement,
    OffenseCategory.moneyLaundering,
    OffenseCategory.bailJumping,
  ],
  offenseMotorVehicle: [
    OffenseCategory.diuDwi,
    OffenseCategory.hitAndRun,
    OffenseCategory.fleeingPolice,
    OffenseCategory.vehicularHomicide,
    OffenseCategory.vehicularManslaughter,
  ],
} as OffenseWizardType;

export const emptyOffenses = {
  offenseDrugs: [],
  offensePropertyDamage: [],
  offenseSexual: [],
  offenseTheft: [],
  offenseViolent: [],
  offenseWhiteCollar: [],
  offenseMotorVehicle: [],
};
