import { Template } from 'aws-cdk-lib/assertions';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';
import { resolve } from 'path';
import snapshotDiff from 'snapshot-diff';
import { createConfig, createTestApp } from '@test';
import { WebStack } from '../WebStack';

jest.mock('aws-cdk-lib/aws-s3-deployment');
jest.mock('../config', () => ({
  getEnvId: (id: string) => `Test-${id}`,
}));

interface Configure {
  domainName?: string;
  deploy?: boolean;
}

const configure = (
  config: any,
  { domainName = 'www.example.com', deploy = false }: Configure = {},
) => {
  config.get
    .mockReturnValueOnce(domainName)
    .mockReturnValueOnce({ SomeSecret: { env: 'SOME_SECRET_ENV' } })
    .mockReturnValueOnce('SOME_SECRET_ENV')
    .mockReturnValueOnce(domainName)
    .mockReturnValueOnce(domainName)
    .mockReturnValueOnce(domainName)
    .mockReturnValueOnce(deploy);
};

const getBaseCfn = (config: any) => {
  configure(config);
  const { app, env, loadBalancer, vpc } = createTestApp();
  const stack = new WebStack(app, 'WebStack', { config, env, loadBalancer, vpc });
  return Template.fromStack(stack).toJSON();
};

describe('WebStack', () => {
  let config: any;

  beforeEach(() => {
    config = createConfig();
  });

  test('creates web stack', () => {
    const base = getBaseCfn(config);
    expect(base).toMatchSnapshot();
  });

  test('handles non-www domain name', () => {
    const base = getBaseCfn(config);
    configure(config, { domainName: 'example.com' });
    const { app, env, loadBalancer, vpc } = createTestApp();
    const stack = new WebStack(app, 'WebStack', { config, env, loadBalancer, vpc });
    expect(snapshotDiff(base, Template.fromStack(stack).toJSON())).toMatchSnapshot();
  });

  test('deploys assets to S3', () => {
    configure(config, { deploy: true });

    const { app, env, loadBalancer, vpc } = createTestApp();
    new WebStack(app, 'WebStack', { config, env, loadBalancer, vpc });

    expect(s3deploy.BucketDeployment).toBeCalledTimes(1);
    const staticDeploy = (
      s3deploy.BucketDeployment as jest.MockedClass<typeof s3deploy.BucketDeployment>
    ).mock.calls[0][2];
    expect(staticDeploy.destinationKeyPrefix).toBe('_next/static');
    expect(staticDeploy.prune).toBe(false);
    expect(staticDeploy.retainOnDelete).toBe(true);
    expect(s3deploy.Source.asset).toBeCalledTimes(1);
    expect(s3deploy.Source.asset).toHaveBeenCalledWith(
      resolve(__dirname, '../../../web/build/static'),
      {
        exclude: ['*.map'],
      },
    );
  });
});
