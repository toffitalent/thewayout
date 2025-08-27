import { faker } from '@faker-js/faker';
import {
  Age,
  AuthGrantType,
  Ethnicity,
  Experience,
  Gender,
  Industry,
  JobApplicationStatus,
  JobSalaries,
  JobStatus,
  JusticeStatus,
  MaritalStatus,
  NumberOfEmployers,
  OffenseCategory,
  Orientation,
  ReferredBy,
  ReleasedAt,
  Religion,
  RspAccountType,
  RspClient,
  RspClientStatus,
  RspPosition,
  RspRole,
  RspType,
  State,
  StateFederal,
  Support,
  TimeServed,
  TypeOfWork,
  UserType,
  VeteranOrJustice,
  VeteranStatus,
  WorkingTime,
  YearsInBusiness,
} from '@two/shared';
import type { App, AppClient, Client, Job, User } from '@app/models';
import { Employer } from '@app/models/Employer';
// eslint-disable-next-line import/no-cycle
import { app, rsp1, user1, user3 } from './fixtures';
import { getId } from './ids';

export function createFakeApp(app?: Partial<App>) {
  return {
    id: getId(),
    name: 'Test App',
    userId: user1.id,
    ...app,
  };
}

export function createFakeClient(client?: Partial<AppClient>) {
  return {
    id: getId(),
    appId: app.id,
    name: 'Test Client',
    secret: '4kdqRmEOXeLEjS5PSmBEA2TMZfU9XwJimeNi9Ez/q9o=',
    grantType: AuthGrantType.Password,
    ...client,
  };
}

export function createFakeUser(user?: Partial<User>) {
  const firstName = user?.firstName || faker.name.firstName();
  const lastName = user?.lastName || faker.name.lastName();
  const email =
    user?.email || faker.internet.email(firstName, lastName, 'example.com').toLowerCase();
  const roles = user?.roles || [UserType.Client];

  return {
    id: getId(),
    lastName,
    // Default password: DLabs2018!
    password: user?.password || '$2b$12$zU/g7vtuUjlolqxtV6u.2eKPLUGPA9cr10SBNhnkwo.tTsRnornZa',
    ...user,
    firstName,
    email,
    roles,
  };
}

export function createFakeEmployer(employer?: Partial<Employer>) {
  return {
    id: getId(),
    name: faker.company.name(),
    industry: Industry.accounting,
    description: faker.lorem.sentences(),
    yearsInBusiness: YearsInBusiness['0-3'],
    numberOfEmployees: NumberOfEmployers['10000+'],
    address: faker.address.street(),
    city: faker.address.city(),
    state: State.AK,
    postalCode: faker.address.zipCode(),
    ...employer,
  };
}

export function createFakeClientProfile(client?: Partial<Client>) {
  return {
    id: getId(),
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    justiceStatus: JusticeStatus.freeWorld,
    address: faker.address.street(),
    city: faker.address.city(),
    state: State.AK,
    postalCode: faker.address.zipCode('#####'),
    support: [Support.employment],
    gender: Gender.female,
    orientation: Orientation.heterosexual,
    religion: Religion.noReligion,
    maritalStatus: MaritalStatus.married,
    age: Age['25-34'],
    disability: false,
    ethnicity: Ethnicity.eastAsian,
    veteranStatus: VeteranStatus.notVeteran,
    referredBy: ReferredBy.newsMedia,
    personalStrengths: [],
    experience: [],
    languages: [],
    offense: [OffenseCategory.burglary],
    sexualOffenderRegistry: false,
    sbn: false,
    timeServed: TimeServed.timeServed01,
    releasedAt: ReleasedAt.releasedAt01,
    stateOrFederal: StateFederal.federal,
    relativeExperience: [],
    personalSummary: faker.lorem.text(),
    education: [],
    license: [],
    veteranOrJustice: [VeteranOrJustice.justiceImpacted],
    ...client,
  };
}

export function createFakeJob(job?: Partial<Job>) {
  return {
    id: getId(),
    title: faker.name.jobTitle(),
    description: faker.lorem.text(),
    salaryOptions: {
      min: '30',
      max: '40',
      salary: JobSalaries.hourly,
      description: faker.lorem.text(),
      bonuses: [],
    },
    workingTime: WorkingTime.fullTime,
    department: 'Customer Service',
    typeOfWork: TypeOfWork.hybrid,
    experience: Experience.entry,
    numberOfOpenPositions: 3,
    responsibilities: [faker.lorem.text(), faker.lorem.text()],
    skillsDescription: faker.lorem.text(),
    startDate: '10.2022',
    status: JobStatus.active,
    offenses: [
      OffenseCategory.distribution,
      OffenseCategory.diuDwi,
      OffenseCategory.battery,
      OffenseCategory.burglary,
      OffenseCategory.arson,
      OffenseCategory.bailJumping,
    ],
    veteranOrJustice: [VeteranOrJustice.justiceImpacted, VeteranOrJustice.veteran],
    ...job,
  };
}

export function createFakeApplication(jobId: string, clientId: string) {
  return {
    id: getId(),
    jobId,
    clientId,
    status: JobApplicationStatus.applied,
  };
}

export function createFakeRsp(rsp?: Partial<RspType>) {
  return {
    id: getId(),
    name: faker.company.name(),
    description: faker.lorem.text(),
    address: faker.address.street(),
    city: faker.address.city(),
    state: State.AK,
    postalCode: faker.address.zipCode('#####'),
    servicesArea: ['Adams', 'Ashland', 'Barron'],
    support: [
      Support.basicHygieneSupport,
      Support.clothing,
      Support.basicTechSkills,
      Support.childCare,
    ],
    justiceStatus: [JusticeStatus.halfwayHouse, JusticeStatus.parole],
    offenses: [
      OffenseCategory.burglary,
      OffenseCategory.distribution,
      OffenseCategory.diuDwi,
      OffenseCategory.embezzlement,
    ],
    veteranOrJustice: [VeteranOrJustice.justiceImpacted],
    ...rsp,
  };
}

export function createFakeRspAccount(rsp?: Partial<RspAccountType>) {
  return {
    id: getId(),
    role: RspRole.owner,
    isProfileFilled: true,
    position: RspPosition.caseManager,
    ...rsp,
  };
}

export function createFakeRspClient(client?: Partial<RspClient>) {
  return {
    id: getId(),
    status: RspClientStatus.pending,
    userId: user3.id,
    rspId: rsp1.id,
    ...client,
  };
}

// eslint-disable-next-line
// @ts-ignore
export { camelCaseKeys, snakeCaseKeys } from 'objection/lib/utils/identifierMapping';
