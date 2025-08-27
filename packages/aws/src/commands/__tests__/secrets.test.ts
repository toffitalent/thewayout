import chalk from 'chalk';
import { execSync } from 'child_process';
import { prompt } from 'inquirer';
import { secrets } from '../secrets';

jest.mock('child_process', () => ({
  execSync: jest.fn(),
}));

jest.mock('../../config/secrets', () => ({
  secrets: {
    TestSecret: {
      description: 'Test secret description',
      env: 'TEST_SECRET',
    },
  },
}));

describe('secrets', () => {
  let log: jest.SpyInstance;

  beforeEach(() => {
    log = jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  test('prompts for secrets and stores in Secrets Manager', async () => {
    (prompt as unknown as jest.Mock).mockResolvedValue({ answer: '__SECRET__' });
    await secrets({ region: 'us-west-2' });

    expect(execSync).toBeCalledTimes(4);
    expect(prompt).toBeCalledTimes(1);
    expect(execSync).toBeCalledWith('aws sts get-caller-identity', {
      stdio: ['ignore', 'ignore', 'pipe'],
    });
    expect(execSync).toBeCalledWith('aws secretsmanager list-secrets', {
      stdio: ['ignore', 'ignore', 'pipe'],
    });
    expect(execSync).toBeCalledWith(
      `aws secretsmanager get-secret-value --region us-west-2 --secret-id TestSecret --query SecretString --output text`,
      { stdio: ['ignore', 'pipe', 'ignore'] },
    );
    expect(execSync).toBeCalledWith(
      `aws secretsmanager put-secret-value --region us-west-2 --secret-id TestSecret --secret-string "__SECRET__"`,
    );
    expect(prompt).toBeCalledWith([
      {
        type: 'input',
        name: 'answer',
        default: undefined,
        message: 'Test secret description:',
      },
    ]);
  });

  test('creates secret if does not exist', async () => {
    const error = new Error('Secret does not exist');
    (execSync as jest.Mock)
      .mockReturnValueOnce(undefined)
      .mockReturnValueOnce(undefined)
      .mockReturnValueOnce(undefined)
      .mockImplementationOnce(() => {
        throw error;
      })
      .mockReturnValueOnce(undefined);
    (prompt as unknown as jest.Mock).mockResolvedValue({ answer: '__SECRET__' });
    await secrets({ region: 'us-west-2' });
    expect(execSync).toBeCalledTimes(5);
    expect(prompt).toBeCalledTimes(1);
    expect(execSync).toBeCalledWith(
      `aws secretsmanager create-secret --region us-west-2 --name TestSecret --secret-string "__SECRET__"`,
    );
  });

  test('logs error if cannot access current secrets', async () => {
    (execSync as jest.Mock).mockImplementation(() => {
      throw new Error('Invalid credentials');
    });
    await secrets({ region: 'us-west-2' });
    expect(execSync).toBeCalledTimes(1);
    expect(log).toBeCalledWith(`${chalk.red('error')} AWS authentication/permission error`);
  });

  test('logs error if fails to create secret in Secrets Manager', async () => {
    const error = new Error('Secret failed to create');
    (execSync as jest.Mock)
      .mockReturnValueOnce(undefined)
      .mockReturnValueOnce(undefined)
      .mockReturnValueOnce(undefined)
      .mockImplementationOnce(() => {
        throw new Error('Secret does not exist');
      })
      .mockImplementationOnce(() => {
        throw error;
      });
    (prompt as unknown as jest.Mock).mockResolvedValue({ answer: '__SECRET__' });
    await secrets({ region: 'us-west-2' });

    expect(execSync).toBeCalledTimes(5);
    expect(log).toBeCalledWith(`${chalk.red('error')} Failed to create secret`, error);
  });
});
