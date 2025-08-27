import { aws_iam as iam, Stack } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import snapshotDiff from 'snapshot-diff';
import { createConfig, createTestApp } from '@test';
import { UploadsStack } from '../UploadsStack';

const configure = (config: any) =>
  config.get
    .mockReturnValueOnce('uploads-bucket')
    .mockReturnValueOnce('https://uploads.example.com');

const createRole = (stack: Stack) =>
  new iam.Role(stack, 'Role', {
    assumedBy: new iam.ServicePrincipal('ecs.amazonaws.com'),
  });

const getBaseCfn = (config: any) => {
  configure(config);
  const { app, env, utilsStack } = createTestApp();
  const apiRole = createRole(utilsStack);
  const stack = new UploadsStack(app, 'UploadsStack', { apiRole, config, env });
  return Template.fromStack(stack).toJSON();
};

describe('UploadsStack', () => {
  let config: any;

  beforeEach(() => {
    config = createConfig();
  });

  test('creates media stack', () => {
    const base = getBaseCfn(config);
    expect(base).toMatchSnapshot();
  });

  test('sets removal policy to destroy for non-production stacks', () => {
    const base = getBaseCfn(config);
    configure(config);
    config.environment.mockReturnValue(false);
    const { app, env, utilsStack } = createTestApp();
    const apiRole = createRole(utilsStack);
    const stack = new UploadsStack(app, 'UploadsStack', { apiRole, config, env });
    expect(snapshotDiff(base, Template.fromStack(stack).toJSON())).toMatchSnapshot();
  });
});
