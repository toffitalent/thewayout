import path from 'path';
import pug from 'pug';
import config from '@two/config';

export function renderTemplate(
  template: string,
  variant: 'html' | 'subject' | 'text',
  context: object = {},
): string {
  return pug.renderFile(
    path.resolve(__dirname, '../src/emails/', template, `template.${variant}.pug`),
    {
      require: (filename: string) => `${filename}`,
      config,
      ...context,
    },
  );
}
