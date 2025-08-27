import { Email } from '../Email';
import html from './template.html.pug';
import subject from './template.subject.pug';
import text from './template.text.pug';

export interface RspApplicationContext {
  user: {
    firstName: string;
  };
  reentryServiceProvider: string;
}

export class RspApplication extends Email<RspApplicationContext> {
  html = html;
  subject = subject;
  text = text;
}
