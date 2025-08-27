import { Email } from '../Email';
import html from './template.html.pug';
import subject from './template.subject.pug';
import text from './template.text.pug';

export interface SecurityEmailContext {
  user: {
    firstName: string;
  };
}

export class SecurityEmail extends Email<SecurityEmailContext> {
  html = html;
  subject = subject;
  text = text;
}
