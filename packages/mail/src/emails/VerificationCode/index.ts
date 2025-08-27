import { Email } from '../Email';
import html from './template.html.pug';
import subject from './template.subject.pug';
import text from './template.text.pug';

export interface VerificationCodeContext {
  code: string;
  user?: {
    firstName: string;
  };
}

export class VerificationCode extends Email<VerificationCodeContext> {
  html = html;
  subject = subject;
  text = text;
}
