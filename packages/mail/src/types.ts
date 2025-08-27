import type { SendMailOptions } from 'nodemailer';
import type { Address } from 'nodemailer/lib/mailer';
import type { EmailId, Emails } from './emails';

export interface EmailMessage<T extends EmailId> extends SendMailOptions {
  template: T;
  context: ConstructorParameters<(typeof Emails)[T]>[0];
  to: string | Address;
}
