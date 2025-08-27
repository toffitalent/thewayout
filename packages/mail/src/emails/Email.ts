import juice from 'juice';
import type { SendMailOptions } from 'nodemailer';
import config from '@two/config';

export type Config = typeof config;

export interface RenderedEmail extends SendMailOptions {
  html: string;
  text: string;
  subject: string;
}

export type EmailContext<Context extends object> = Context & { config: Config };

export abstract class Email<Context extends object> {
  constructor(private context: Context) {}

  abstract html(context: EmailContext<Context>): string;
  abstract text(context: EmailContext<Context>): string;
  abstract subject(context: EmailContext<Context>): string;

  getContext(): EmailContext<Context> {
    return {
      ...this.context,
      config,
    };
  }

  async render(): Promise<RenderedEmail> {
    const context = this.getContext();

    return {
      html: await juiceResources(this.html(context)),
      text: this.text(context),
      subject: this.subject(context),
    };
  }
}

juice.tableElements = [
  'TABLE',
  'TH',
  'TR',
  'TD',
  'CAPTION',
  'COLGROUP',
  'COL',
  'THEAD',
  'TBODY',
  'TFOOT',
] as any;

function juiceResources(html: string): Promise<string> {
  return new Promise((resolve, reject) => {
    juice.juiceResources(
      html,
      {
        preserveImportant: true,
        webResources: {
          images: false,
          relativeTo: __dirname,
        },
      },
      (err, html) => {
        if (err) {
          reject(err);
        } else {
          resolve(html);
        }
      },
    );
  });
}
