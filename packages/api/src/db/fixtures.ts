import { faker } from '@faker-js/faker';
import {
  Age,
  Ethnicity,
  ExperienceSkills,
  Gender,
  Language,
  LanguageLevel,
  OffenseCategory,
  PersonalStrengths,
  RspClientStatus,
  RspRole,
  StateFederal,
  Support,
  UserType,
  VeteranBranchOfService,
  VeteranCampaign,
  VeteranOrJustice,
  VeteranRank,
  VeteranStatus,
  VeteranTypeDischarge,
} from '@two/shared';
import { resetIds } from './ids';
// eslint-disable-next-line import/no-cycle
import {
  createFakeApp,
  createFakeApplication,
  createFakeClient,
  createFakeClientProfile,
  createFakeEmployer,
  createFakeJob,
  createFakeRsp,
  createFakeRspAccount,
  createFakeRspClient,
  createFakeUser,
} from './utils';

// Set faker seed for fixtures
faker.seed(187);
resetIds();

export const user1 = createFakeUser();
export const user2 = createFakeUser();
export const user3 = createFakeUser();
export const user4 = createFakeUser();
export const user5 = createFakeUser({ roles: [UserType.Employer] });
export const user6 = createFakeUser({ roles: [UserType.Employer] });
export const user7 = createFakeUser({ roles: [UserType.Rsp], phone: '1231231234' });
export const user8 = createFakeUser({ roles: [UserType.Rsp], phone: '1231231234' });
export const user9 = createFakeUser({ roles: [UserType.Rsp], phone: '1231231234' });

export const employer1 = createFakeEmployer({ userId: user6.id });

const partialClientData = {
  personalStrengths: [
    PersonalStrengths.creative,
    PersonalStrengths.dealsWellWithChange,
    PersonalStrengths.goodWithTechnology,
    PersonalStrengths.peoplePerson,
    PersonalStrengths.managesTimeWell,
  ],
  experience: [ExperienceSkills.carpentry, ExperienceSkills.education],
  languages: [
    { language: Language.english, level: LanguageLevel.professional },
    { language: Language.spanish, level: LanguageLevel.basic },
  ],
  relativeExperience: [
    {
      title: 'Test',
      company: 'Test',
      startAtMonth: '3',
      startAtYear: '2015',
      endAtMonth: '3',
      endAtYear: '2018',
      location: 'Location',
      description: faker.lorem.sentences(),
    },
  ],
  education: [
    {
      schoolIssuer: 'Test',
      degree: 'Test',
      areaOfStudy: 'Test',
      startYear: '2010',
      yearEarned: '2015',
      description: faker.lorem.sentences(),
    },
  ],
  license: [
    {
      licenseName: 'Test',
      issuingOrganization: 'Test',
      issueAtMonth: '5',
      issueAtYear: '2015',
      expirationAtMonth: null,
      expirationAtYear: null,
    },
  ],
};

export const clientProfile1 = createFakeClientProfile({
  userId: user4.id,
  support: [Support.basicTechSkills, Support.basicHygieneSupport],
  ...partialClientData,
});
export const clientProfile2 = createFakeClientProfile({
  userId: user3.id,
  support: [Support.clothing],
});
export const rsp1 = createFakeRsp();
export const rspAccount1 = createFakeRspAccount({ userId: user7.id, rspId: rsp1.id });
export const rspAccount2 = createFakeRspAccount({
  userId: user8.id,
  rspId: rsp1.id,
  role: RspRole.member,
});
export const rspAccount3 = createFakeRspAccount({
  userId: user9.id,
  role: RspRole.owner,
  isProfileFilled: false,
});
export const rspClient1 = createFakeRspClient({ userId: user3.id });
export const rspClient2 = createFakeRspClient({ userId: user4.id, status: RspClientStatus.active });

export const app = createFakeApp();

export const client = createFakeClient();

export const job1 = createFakeJob({ employerId: employer1.id });
export const job2 = createFakeJob({
  employerId: employer1.id,
  offenses: [
    OffenseCategory.diuDwi,
    OffenseCategory.battery,
    OffenseCategory.burglary,
    OffenseCategory.arson,
    OffenseCategory.bailJumping,
  ],
});
export const job3 = createFakeJob({
  employerId: employer1.id,
  offenses: [
    OffenseCategory.distribution,
    OffenseCategory.pornography,
    OffenseCategory.burglary,
    OffenseCategory.arson,
    OffenseCategory.bailJumping,
  ],
});
export const job4 = createFakeJob({
  employerId: employer1.id,
  offenses: [
    OffenseCategory.distribution,
    OffenseCategory.diuDwi,
    OffenseCategory.pornography,
    OffenseCategory.battery,
    OffenseCategory.burglary,
    OffenseCategory.arson,
  ],
});

export const application1 = createFakeApplication(job1.id, clientProfile1.id);
export const application2 = createFakeApplication(job2.id, clientProfile1.id);
export const application3 = createFakeApplication(job3.id, clientProfile2.id);
export const application4 = createFakeApplication(job4.id, clientProfile2.id);

export const user10 = createFakeUser();
export const user11 = createFakeUser();
export const user12 = createFakeUser();
export const user13 = createFakeUser();

export const clientProfile3 = createFakeClientProfile({
  userId: user10.id,
  expectedReleasedAt: '2024-06-29',
  offense: [OffenseCategory.distribution],
  support: [Support.basicTechSkills],
  gender: Gender.male,
  age: Age['45-54'],
  ethnicity: Ethnicity.blackAfricanAmerican,
  veteranStatus: VeteranStatus.disabled,
  stateOrFederal: StateFederal.state,
});
export const clientProfile4 = createFakeClientProfile({
  userId: user11.id,
  expectedReleasedAt: '2024-08-29',
  offense: [OffenseCategory.diuDwi],
  support: [Support.childCare],
  gender: Gender.preferNotToSay,
  ethnicity: Ethnicity.latinxHispanic,
  stateOrFederal: StateFederal.both,
});
export const clientProfile5 = createFakeClientProfile({
  userId: user12.id,
  expectedReleasedAt: '2024-12-25',
  postalCode: '53910',
  offense: [OffenseCategory.embezzlement],
});
export const clientProfile6 = createFakeClientProfile({
  userId: user13.id,
  expectedReleasedAt: '2024-12-29',
  postalCode: '53910',
  offense: [OffenseCategory.embezzlement],
});

export const rspClient3 = createFakeRspClient({ userId: user10.id });
export const rspClient4 = createFakeRspClient({
  userId: user11.id,
  status: RspClientStatus.active,
});
export const rspClient5 = createFakeRspClient({
  userId: user12.id,
  status: RspClientStatus.active,
  caseManagerId: rspAccount2.id,
});
export const rspClient6 = createFakeRspClient({ userId: user13.id });

export const users = Array.from(Array(25), () => createFakeUser());
export const clientsProfiles = Array.from(users, (user) =>
  createFakeClientProfile({ userId: user.id }),
);
export const rspClients = Array.from(users, (user) =>
  createFakeRspClient({
    userId: user.id,
    status: RspClientStatus.active,
    caseManagerId: rspAccount2.id,
  }),
);

export const rsp2 = createFakeRsp({
  veteranOrJustice: [VeteranOrJustice.justiceImpacted, VeteranOrJustice.veteran],
});
export const user14 = createFakeUser({ roles: [UserType.Rsp] });
export const user15 = createFakeUser({ roles: [UserType.Rsp] });
export const rspAccount4 = createFakeRspAccount({ userId: user14.id, rspId: rsp2.id });
export const rspAccount5 = createFakeRspAccount({
  userId: user15.id,
  rspId: rsp2.id,
  role: RspRole.member,
});
export const user16 = createFakeUser();
export const clientProfile7 = createFakeClientProfile({
  userId: user16.id,
  expectedReleasedAt: '2024-08-29',
  offense: [OffenseCategory.diuDwi],
  support: [Support.childCare],
  gender: Gender.preferNotToSay,
  ethnicity: Ethnicity.latinxHispanic,
  stateOrFederal: StateFederal.both,
  postalCode: '53910',
});
export const rspClient7 = createFakeRspClient({
  userId: user16.id,
  rspId: rsp2.id,
  status: RspClientStatus.active,
  caseManagerId: rspAccount4.id,
});

export const userClientVeteran1 = createFakeUser();
export const userClientVeteran2 = createFakeUser();
export const clientProfileVeteran1 = createFakeClientProfile({
  userId: userClientVeteran1.id,
  firstName: userClientVeteran1.firstName,
  lastName: userClientVeteran1.lastName,
  veteranOrJustice: [VeteranOrJustice.justiceImpacted, VeteranOrJustice.veteran],
  veteranService: [VeteranBranchOfService.usAirForce],
  veteranRank: VeteranRank.AB,
  veteranStartAt: '2000-05-01',
  veteranEndAt: '2010-05-01',
  veteranReservist: true,
  veteranCampaigns: [VeteranCampaign.bosnia],
  veteranTypeDischarge: VeteranTypeDischarge.bcd,
  veteranDd214: true,
  ...partialClientData,
});
export const clientProfileVeteran2 = createFakeClientProfile({
  userId: userClientVeteran2.id,
  firstName: userClientVeteran2.firstName,
  lastName: userClientVeteran2.lastName,
  veteranOrJustice: [VeteranOrJustice.veteran],
  veteranService: [VeteranBranchOfService.usArmy],
  veteranRank: VeteranRank.ADM,
  veteranStartAt: '2005-06-01',
  veteranEndAt: '2015-06-01',
  veteranReservist: false,
  veteranCampaigns: [VeteranCampaign.bosnia],
  veteranTypeDischarge: VeteranTypeDischarge.bcd,
  veteranDd214: true,
  justiceStatus: undefined,
  offense: undefined,
  sexualOffenderRegistry: undefined,
  sbn: undefined,
  timeServed: undefined,
  releasedAt: undefined,
  stateOrFederal: undefined,
  ...partialClientData,
});
export const applicationVeteran1 = createFakeApplication(job1.id, clientProfileVeteran1.id);
export const applicationVeteran2 = createFakeApplication(job1.id, clientProfileVeteran2.id);
export const rspClientVeteran1 = createFakeRspClient({ userId: userClientVeteran1.id });
export const rspClientVeteran2 = createFakeRspClient({ userId: userClientVeteran2.id });

export const userRsp2Owner = createFakeUser({ roles: [UserType.Rsp], phone: '3344444444' });
export const userRsp2Member = createFakeUser({ roles: [UserType.Rsp], phone: '3344444444' });
export const rsp2AccountOwner = createFakeRspAccount({ userId: userRsp2Owner.id, rspId: rsp2.id });
export const rspAccountMember = createFakeRspAccount({
  userId: userRsp2Member.id,
  rspId: rsp2.id,
  role: RspRole.member,
});
export const rsp2UserClient1 = createFakeUser();
export const rsp2UserClient2 = createFakeUser();
export const rsp2Client1 = createFakeClientProfile({
  userId: rsp2UserClient1.id,
  firstName: rsp2UserClient1.firstName,
  lastName: rsp2UserClient1.lastName,
  veteranOrJustice: [VeteranOrJustice.justiceImpacted, VeteranOrJustice.veteran],
  veteranService: [VeteranBranchOfService.usAirForce],
  veteranRank: VeteranRank.AB,
  veteranStartAt: '2000-05-01',
  veteranEndAt: '2010-05-01',
  veteranReservist: true,
  veteranCampaigns: [VeteranCampaign.bosnia],
  veteranTypeDischarge: VeteranTypeDischarge.bcd,
  veteranDd214: true,
  ...partialClientData,
});
export const rsp2Client2 = createFakeClientProfile({
  userId: rsp2UserClient2.id,
  firstName: rsp2UserClient2.firstName,
  lastName: rsp2UserClient2.lastName,
  veteranOrJustice: [VeteranOrJustice.veteran],
  veteranService: [VeteranBranchOfService.usArmy],
  veteranRank: VeteranRank.ADM,
  veteranStartAt: '2005-06-01',
  veteranEndAt: '2015-06-01',
  veteranReservist: false,
  veteranCampaigns: [VeteranCampaign.bosnia],
  veteranTypeDischarge: VeteranTypeDischarge.bcd,
  veteranDd214: true,
  justiceStatus: undefined,
  offense: undefined,
  sexualOffenderRegistry: undefined,
  sbn: undefined,
  timeServed: undefined,
  releasedAt: undefined,
  stateOrFederal: undefined,
  ...partialClientData,
});
export const rsp2ClientJusticeImpacted = createFakeRspClient({
  userId: rsp2UserClient1.id,
  rspId: rsp2.id,
});
export const rsp2ClientVeteran = createFakeRspClient({
  userId: rsp2UserClient2.id,
  rspId: rsp2.id,
});
