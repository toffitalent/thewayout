import { ApplicationLoadBalancer } from '@disruptive-labs/aws';
import {
  App,
  aws_ec2 as ec2,
  aws_ecr as ecr,
  aws_route53 as route53,
  Stack,
  StackProps,
} from 'aws-cdk-lib';

const env = { account: '1111111111', region: 'us-west-2' };

export const createConfig = (getValue = '', environment = 'production') => ({
  environment: jest
    .fn()
    .mockImplementation((...env: string[]) =>
      env.length ? env.includes(environment) : environment,
    ),
  get: jest.fn().mockReturnValue(getValue),
});

export const createTestApp = (props: StackProps = { env }) => {
  const app = new App();

  // Common utils
  const utilsStack = new Stack(app, 'UtilsStack', props);
  const hostedZone = new route53.HostedZone(utilsStack, 'HostedZone', { zoneName: 'example.com' });
  const repository = ecr.Repository.fromRepositoryName(utilsStack, 'Repository', 'example');
  const vpc = new ec2.Vpc(utilsStack, 'Vpc');
  const loadBalancer = new ApplicationLoadBalancer(utilsStack, 'LB', {
    domainName: 'example.com',
    domainZone: hostedZone,
    vpc,
  });

  const stack = new Stack(app, 'TestStack', props);

  return {
    app,
    env,
    hostedZone,
    loadBalancer,
    repository,
    stack,
    utilsStack,
    vpc,
  };
};
