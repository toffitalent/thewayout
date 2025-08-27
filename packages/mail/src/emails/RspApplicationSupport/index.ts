import { JusticeStatus } from '@two/shared';
import { Email, EmailContext } from '../Email';
import html from './template.html.pug';
import subject from './template.subject.pug';
import text from './template.text.pug';

export interface RspApplicationSupportContext {
  user: {
    name: string;
    address: string;
    email: string;
    phone: string;
    support: string;
    offense: string;
    justiceStatus?: JusticeStatus;
    facility?: string | null;
    expectedReleasedAt?: string | null;
  };
  rsp: {
    caseManagerFirstName: string;
    name: string;
  };
}

export class RspApplicationSupport extends Email<RspApplicationSupportContext> {
  html = html;
  subject = subject;
  text = text;

  getContext(): EmailContext<RspApplicationSupportContext> {
    const { user, ...context } = super.getContext();
    const { justiceStatus, facility, expectedReleasedAt, ...rest } = user;

    return {
      ...context,
      user: {
        ...rest,
        ...(justiceStatus === JusticeStatus.currentlyIncarcerated && { justiceStatus }),
        ...(justiceStatus === JusticeStatus.currentlyIncarcerated && { facility }),
        ...(justiceStatus === JusticeStatus.currentlyIncarcerated && { expectedReleasedAt }),
      },
    };
  }
}
