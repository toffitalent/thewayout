import { aws_ecs as ecs, aws_ecs_patterns as ecsPatterns } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import snapshotDiff from 'snapshot-diff';
import { createConfig, createTestApp } from '@test';
import { ApiStack } from '../ApiStack';

const getBaseCfn = (config: any) => {
  config.environment.mockImplementation((env?: string) => (env ? true : 'production'));
  config.get
    .mockReturnValueOnce('www.example.com')
    .mockReturnValueOnce({ SomeSecret: { env: 'SOME_SECRET_ENV' } })
    .mockReturnValueOnce('SOME_SECRET_ENV');

  const { app, env, loadBalancer, vpc } = createTestApp();
  const stack = new ApiStack(app, 'ApiStack', { config, env, loadBalancer, vpc });
  return Template.fromStack(stack).toJSON();
};

describe('ApiStack', () => {
  let config: any;

  beforeEach(() => {
    config = createConfig();
  });

  test('creates API stack', () => {
    const base = getBaseCfn(config);
    expect(base).toMatchSnapshot();
  });

  test('sets database removal policy to snapshot for non-production environments', () => {
    const base = getBaseCfn(config);

    config.environment.mockImplementation((env?: string) => (env ? false : 'staging'));
    config.get
      .mockReturnValueOnce('www.example.com')
      .mockReturnValueOnce({ SomeSecret: { env: 'SOME_SECRET_ENV' } })
      .mockReturnValueOnce('SOME_SECRET_ENV');

    const { app, env, loadBalancer, vpc } = createTestApp();
    const stack = new ApiStack(app, 'ApiStack', { config, env, loadBalancer, vpc });
    expect(snapshotDiff(base, Template.fromStack(stack).toJSON())).toMatchSnapshot();
  });

  test('grants send message permission to mail SQS queue', () => {
    const base = getBaseCfn(config);

    config.environment.mockReturnValueOnce(true);
    config.get
      .mockReturnValueOnce('www.example.com')
      .mockReturnValueOnce({ SomeSecret: { env: 'SOME_SECRET_ENV' } })
      .mockReturnValueOnce('SOME_SECRET_ENV');

    const { app, env, loadBalancer, repository, utilsStack, vpc } = createTestApp();
    const mail = new ecsPatterns.QueueProcessingFargateService(utilsStack, 'Mail', {
      image: ecs.ContainerImage.fromEcrRepository(repository, 'latest'),
      vpc,
    });

    const spy = jest.spyOn(mail.sqsQueue, 'grantSendMessages');
    const stack = new ApiStack(app, 'ApiStack', { config, env, loadBalancer, vpc, mail });
    expect(spy).toBeCalledWith(stack.role);
    expect(snapshotDiff(base, Template.fromStack(stack).toJSON())).toMatchSnapshot();
  });
});
