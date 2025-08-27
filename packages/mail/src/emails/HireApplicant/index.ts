import { getUrl } from '@app/utils';
import { Email, EmailContext } from '../Email';
import html from './template.html.pug';
import subject from './template.subject.pug';
import text from './template.text.pug';

export interface HireApplicantContext {
  client: {
    firstName: string;
  };
  company: {
    name: string;
  };
  offerTitle: string;
}

export class HireApplicant extends Email<HireApplicantContext> {
  html = html;
  subject = subject;
  text = text;

  getContext(): EmailContext<HireApplicantContext & { dashboardPageUrl: string }> {
    const context = super.getContext();
    return {
      dashboardPageUrl: getUrl('/client'),
      ...context,
    };
  }
}
