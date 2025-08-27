import { getUrl } from '@app/utils';
import { Email, EmailContext } from '../Email';
import html from './template.html.pug';
import subject from './template.subject.pug';
import text from './template.text.pug';

export interface JobApplicationContext {
  employer: {
    firstName: string;
  };
  offerTitle: string;
}

export class JobApplication extends Email<JobApplicationContext> {
  html = html;
  subject = subject;
  text = text;

  getContext(): EmailContext<JobApplicationContext & { dashboardPageUrl: string }> {
    const context = super.getContext();
    return {
      dashboardPageUrl: getUrl('/employer'),
      ...context,
    };
  }
}
