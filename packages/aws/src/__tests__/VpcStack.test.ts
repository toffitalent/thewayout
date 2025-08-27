import { Template } from 'aws-cdk-lib/assertions';
import { createConfig, createTestApp } from '@test';
import { VpcStack } from '../VpcStack';

describe('VpcStack', () => {
  test('creates VPC', () => {
    const config = createConfig() as any;
    config.get.mockReturnValueOnce('example.com');

    const { app, env } = createTestApp();
    const stack = new VpcStack(app, 'VpcStack', { config, env });
    expect(Template.fromStack(stack).toJSON()).toMatchSnapshot();
  });
});
