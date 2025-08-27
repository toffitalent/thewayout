import { Email } from '../Email';
import html from './template.html.pug';
import subject from './template.subject.pug';
import text from './template.text.pug';

export interface SecurityPasswordContext {
  user: {
    firstName: string;
  };
}

export class SecurityPassword extends Email<SecurityPasswordContext> {
  html = html;
  subject = subject;
  text = text;
}
