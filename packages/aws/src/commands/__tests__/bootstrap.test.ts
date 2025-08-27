import chalk from 'chalk';
import { execSync } from 'child_process';
import { bootstrap, defaults, getGroupPolicy } from '../bootstrap';

jest.mock('child_process', () => ({
  execSync: jest.fn(),
}));

describe('bootstrap', () => {
  let log: jest.SpyInstance;

  beforeEach(() => {
    log = jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  test('bootstraps AWS environments', () => {
    bootstrap({
      environment: 'production',
      account: '111111111',
      region: 'us-west-2',
      repos: ['test'],
    });

    expect(execSync).toBeCalledTimes(4);
    expect(execSync).toBeCalledWith(
      'AWS_ACCOUNT=111111111 ./node_modules/.bin/cdk bootstrap -c env=production aws://111111111/us-west-2 aws://111111111/us-east-1',
      { stdio: ['ignore', 'ignore', 'pipe'] },
    );
    expect(execSync).toBeCalledWith('aws iam get-group --group-name deploy', { stdio: 'ignore' });
    expect(execSync).toBeCalledWith(
      'aws ecr create-repository --region us-west-2 --repository-name test',
    );
    expect(execSync).toBeCalledWith(
      `aws ecr put-lifecycle-policy --region us-west-2 --repository-name test --lifecycle-policy-text '${JSON.stringify(
        defaults.repositoryLifecyclePolicy,
      )}'`,
    );
  });

  test('retrieves account number if not supplied', () => {
    (execSync as jest.Mock).mockReturnValueOnce('111111111');
    bootstrap({ environment: 'production', region: 'us-west-2', repos: ['test'] });
    expect(execSync).toBeCalledTimes(5);
    expect(execSync).toBeCalledWith('aws sts get-caller-identity --query Account --output text');
  });

  test('creates deploy IAM group if does not exist', () => {
    (execSync as jest.Mock)
      .mockReturnValueOnce(undefined)
      .mockImplementationOnce(() => {
        throw new Error('IAM group does not exist');
      })
      .mockReturnValue(undefined)
      .mockReturnValue(JSON.stringify({ Policy: { Arn: 'arn:aws:iam:111111111:policy/deploy' } }));

    bootstrap({
      environment: 'production',
      account: '111111111',
      region: 'us-west-2',
      repos: ['test'],
    });

    expect(execSync).toBeCalledTimes(7);
    expect(execSync).toBeCalledWith('aws iam create-group --group-name deploy');
    expect(execSync).toBeCalledWith(
      `aws iam create-policy --policy-name deploy --policy-document '${JSON.stringify(
        getGroupPolicy('111111111', 'us-west-2', ['test']),
      )}'`,
    );
    expect(execSync).toBeCalledWith(
      'aws iam attach-group-policy --group-name deploy --policy-arn arn:aws:iam:111111111:policy/deploy',
    );
  });

  test('logs error if bootstrapping fails', () => {
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const error = new Error('Bootstrapping failed');
    (execSync as jest.Mock).mockImplementation(() => {
      throw error;
    });

    bootstrap({
      environment: 'production',
      account: '111111111',
      region: 'us-west-2',
      repos: ['test'],
    });

    expect(execSync).toBeCalledTimes(1);
    expect(spy).toBeCalledWith(`${chalk.red('error')} Bootstrapping failed`, error);
  });

  test('logs error if ECR repository creation fails', () => {
    const error = new Error('ECR repo failed to create');
    (execSync as jest.Mock)
      .mockReturnValueOnce(undefined)
      .mockReturnValueOnce(undefined)
      .mockImplementation(() => {
        throw error;
      });

    bootstrap({
      environment: 'production',
      account: '111111111',
      region: 'us-west-2',
      repos: ['test'],
    });

    expect(execSync).toBeCalledTimes(3);
    expect(log).toBeCalledWith(
      `${chalk.red('error')} Failed to create ECR repository ${chalk.bold('test')}`,
    );
  });
});
