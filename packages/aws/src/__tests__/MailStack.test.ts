import { Template } from 'aws-cdk-lib/assertions';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';
import { resolve } from 'path';
import { createConfig, createTestApp } from '@test';
import { MailStack } from '../MailStack';

jest.mock('aws-cdk-lib/aws-s3-deployment');

describe('MailStack', () => {
  let config: any;

  beforeEach(() => {
    config = createConfig();
  });

  test('creates mail stack', () => {
    config.get
      .mockReturnValueOnce('https://mail.example.com')
      .mockReturnValueOnce('https://www.example.com')
      .mockReturnValueOnce({ SomeSecret: { env: 'SOME_SECRET_ENV' } })
      .mockReturnValueOnce('SOME_SECRET_ENV')
      .mockReturnValueOnce('mail.example.com')
      .mockReturnValueOnce(false);

    const { app, env, vpc } = createTestApp();
    const stack = new MailStack(app, 'MailStack', { config, env, vpc });
    expect(Template.fromStack(stack).toJSON()).toMatchSnapshot();
  });

  test('deploys assets to S3', () => {
    config.get
      .mockReturnValueOnce('https://mail.example.com')
      .mockReturnValueOnce('https://www.example.com')
      .mockReturnValueOnce({ SomeSecret: { env: 'SOME_SECRET_ENV' } })
      .mockReturnValueOnce('SOME_SECRET_ENV')
      .mockReturnValueOnce('mail.example.com')
      .mockReturnValueOnce(true);

    const { app, env, vpc } = createTestApp();
    new MailStack(app, 'MailStack', { config, env, vpc });

    expect(s3deploy.BucketDeployment).toBeCalledTimes(1);
    const assetsDeploy = (
      s3deploy.BucketDeployment as jest.MockedClass<typeof s3deploy.BucketDeployment>
    ).mock.calls[0][2];
    expect(assetsDeploy.destinationKeyPrefix).toBe('assets');
    expect(assetsDeploy.prune).toBe(false);
    expect(assetsDeploy.retainOnDelete).toBe(true);
    expect(s3deploy.Source.asset).toBeCalledTimes(1);
    expect(s3deploy.Source.asset).toHaveBeenCalledWith(
      resolve(__dirname, '../../../mail/build/dist/assets'),
      { exclude: ['*.map'] },
    );
  });
});
