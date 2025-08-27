import { getUrl } from '@app/utils';
import { Email, EmailContext } from '../Email';
import html from './template.html.pug';
import subject from './template.subject.pug';
import text from './template.text.pug';

export interface PasswordResetContext {
  token: string;
  user: {
    firstName: string;
    username: string;
  };
}

export class PasswordReset extends Email<PasswordResetContext> {
  html = html;
  subject = subject;
  text = text;

  getContext(): EmailContext<PasswordResetContext & { url: string }> {
    const context = super.getContext();
    return {
      url: getUrl('/reset-password/', { token: context.token, username: context.user.username }),
      ...context,
    };
  }
}
