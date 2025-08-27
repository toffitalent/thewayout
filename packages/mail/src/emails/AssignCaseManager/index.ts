import { getUrl } from '@app/utils';
import { Email, EmailContext } from '../Email';
import html from './template.html.pug';
import subject from './template.subject.pug';
import text from './template.text.pug';

export interface AssignCaseManagerContext {
  firstName: string;
  rspName: string;
  rspClientId: string;
  client: {
    firstName: string;
    lastName: string;
  };
}

export class AssignCaseManager extends Email<AssignCaseManagerContext> {
  html = html;
  subject = subject;
  text = text;

  getContext(): EmailContext<AssignCaseManagerContext & { url: string }> {
    const context = super.getContext();
    return {
      url: getUrl(`ssp/clients/${context.rspClientId}`),
      ...context,
    };
  }
}
