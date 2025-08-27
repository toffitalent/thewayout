import chalk from 'chalk';
import { execSync } from 'child_process';
import { prompt } from 'inquirer';
import { secrets as secretsConfig } from '../config/secrets';

export const secrets = async (argv: any) => {
  const { region } = argv;

  try {
    execSync('aws sts get-caller-identity', { stdio: ['ignore', 'ignore', 'pipe'] });
    execSync('aws secretsmanager list-secrets', { stdio: ['ignore', 'ignore', 'pipe'] });
  } catch (err) {
    console.log(`${chalk.red('error')} AWS authentication/permission error`);
    return;
  }

  const secretsKeys = Object.keys(secretsConfig);

  for (const key of secretsKeys) {
    let currentValue = '';

    try {
      currentValue = execSync(
        `aws secretsmanager get-secret-value --region ${region} --secret-id ${key} --query SecretString --output text`,
        { stdio: ['ignore', 'pipe', 'ignore'] },
      ).toString();
    } catch (err) {
      // Ignore
    }

    try {
      const { answer } = await prompt([
        {
          type: 'input',
          name: 'answer',
          default: currentValue || undefined,
          message: `${secretsConfig[key as keyof typeof secretsConfig].description}:`,
        },
      ]);

      // Update secret if exists, otherwise create secret
      try {
        execSync(
          `aws secretsmanager put-secret-value --region ${region} --secret-id ${key} --secret-string "${answer.trim()}"`,
        );
      } catch (err) {
        execSync(
          `aws secretsmanager create-secret --region ${region} --name ${key} --secret-string "${answer.trim()}"`,
        );
      }

      console.log(`${chalk.blue('info')} Created secret ${key} in ${region}`);
    } catch (err) {
      console.log(`${chalk.red('error')} Failed to create secret`, err);
      return;
    }
  }

  console.log(`${chalk.green('success')} Secrets created`);
};
