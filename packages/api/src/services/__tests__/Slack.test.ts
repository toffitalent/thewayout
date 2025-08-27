import axios from 'axios';
import config from '@two/config';
import * as Slack from '../Slack';

describe('Slack', () => {
  describe('alert()', () => {
    test('sends alert message to Slack channel', async () => {
      jest.spyOn(config, 'get').mockImplementationOnce(() => 'http://example.com/slack-test');
      const spy = jest.spyOn(axios, 'post').mockImplementationOnce(() => Promise.resolve());

      await Slack.alert('__TEST__');
      expect(spy).toBeCalledWith('http://example.com/slack-test', {
        text: '__TEST__',
        blocks: [{ type: 'section', text: { type: 'mrkdwn', text: '__TEST__' } }],
      });
    });

    test('does not send alert message if webhook URL not configured', async () => {
      const spy = jest.spyOn(axios, 'post').mockImplementationOnce(() => Promise.resolve());

      await Slack.alert('__TEST__');
      expect(spy).not.toBeCalled();
    });
  });
});
