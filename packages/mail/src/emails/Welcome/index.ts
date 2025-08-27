import { Email } from '../Email';
import html from './template.html.pug';
import subject from './template.subject.pug';
import text from './template.text.pug';

export interface WelcomeContext {
  user: {
    firstName: string;
  };
}

export class Welcome extends Email<WelcomeContext> {
  html = html;
  subject = subject;
  text = text;
}
