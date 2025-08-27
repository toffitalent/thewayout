import { Email } from '../Email';
import html from './template.html.pug';
import subject from './template.subject.pug';
import text from './template.text.pug';

export interface RequestInterviewContext {
  client: { firstName: string };
  offerTitle: string;
}

export class RequestInterview extends Email<RequestInterviewContext> {
  html = html;
  subject = subject;
  text = text;
}
