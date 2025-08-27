import { getUrl } from '@app/utils';
import { Email, EmailContext } from '../Email';
import html from './template.html.pug';
import subject from './template.subject.pug';
import text from './template.text.pug';

export interface JobApplicationClientContext {
  client: {
    firstName: string;
  };
  offerTitle: string;
}

export class JobApplicationClient extends Email<JobApplicationClientContext> {
  html = html;
  subject = subject;
  text = text;

  getContext(): EmailContext<JobApplicationClientContext & { dashboardPageUrl: string }> {
    const context = super.getContext();
    return {
      dashboardPageUrl: getUrl('/client'),
      ...context,
    };
  }
}
