import axios from 'axios';
import config from '@two/config';
import { Sentry } from './Sentry';

export async function alert(text: string) {
  const url = config.get('slack.alerts');
  if (!url) return;

  await axios
    .post(url, {
      text,
      blocks: [{ type: 'section', text: { type: 'mrkdwn', text } }],
    })
    .catch(Sentry.captureException);
}
