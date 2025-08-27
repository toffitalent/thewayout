import { AssignCaseManager } from './AssignCaseManager';
import { HireApplicant } from './HireApplicant';
import { InviteCaseManager } from './InviteCaseManager';
import { JobApplication } from './JobApplication';
import { JobApplicationClient } from './JobApplicationClient';
import { PasswordReset } from './PasswordReset';
import { RejectApplicant } from './RejectApplicant';
import { RequestInterview } from './RequestInterview';
import { RspApplication } from './RspApplication';
import { RspApplicationSupport } from './RspApplicationSupport';
import { SecurityEmail } from './SecurityEmail';
import { SecurityPassword } from './SecurityPassword';
import { VerificationCode } from './VerificationCode';
import { Welcome } from './Welcome';

export const Emails = {
  PasswordReset,
  SecurityEmail,
  SecurityPassword,
  VerificationCode,
  Welcome,
  JobApplication,
  RequestInterview,
  RspApplicationSupport,
  RspApplication,
  JobApplicationClient,
  HireApplicant,
  RejectApplicant,
  InviteCaseManager,
  AssignCaseManager,
};

export type EmailId = keyof typeof Emails;
