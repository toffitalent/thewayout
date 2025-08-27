import { getUrl } from '@app/utils';
import { Email, EmailContext } from '../Email';
import html from './template.html.pug';
import subject from './template.subject.pug';
import text from './template.text.pug';

export interface InviteCaseManagerContext {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  invitationId: string;
  rspName: string;
}

export class InviteCaseManager extends Email<InviteCaseManagerContext> {
  html = html;
  subject = subject;
  text = text;

  getContext(): EmailContext<InviteCaseManagerContext & { url: string }> {
    const context = super.getContext();
    return {
      url: getUrl('/ssp/signup/', {
        firstName: context.firstName,
        lastName: context.lastName,
        email: context.email,
        phone: context.phone,
        invitationId: context.invitationId,
        rspName: context.rspName,
      }),
      ...context,
    };
  }
}
