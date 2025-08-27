import { renderTemplate } from '@test';
import { RequestInterview } from '..';

describe('RequestInterview', () => {
  const context = {
    client: { firstName: 'Test' },
    offerTitle: 'Test Job Title',
  };

  const email = new RequestInterview(context);

  test('renders correctly', async () => {
    expect(await email.render()).toMatchSnapshot();
    expect(renderTemplate('RequestInterview', 'html', context)).toMatchSnapshot();
    expect(renderTemplate('RequestInterview', 'subject', context)).toMatchSnapshot();
    expect(renderTemplate('RequestInterview', 'text', context)).toMatchSnapshot();
  });
});
