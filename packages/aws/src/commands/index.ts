import yargs from 'yargs';
import { bootstrap, defaults as bootstrapDefaults } from './bootstrap';
import { secrets } from './secrets';

const { hideBin } = require('yargs/helpers');

yargs(hideBin(process.argv))
  .command(
    'bootstrap',
    'Bootstrap an AWS environment for CDK usage',
    (args) => {
      args
        .option('environment', {
          alias: 'e',
          type: 'string',
          default: 'production',
          description: 'Environment to use for CDK build',
        })
        .option('repos', {
          type: 'array',
          default: bootstrapDefaults.repositories,
          description: 'ECR repositories to create',
        })
        .option('cf-region', {
          type: 'boolean',
          default: true,
          description:
            'Disable automatic bootstrapping of us-east-1 for CloudFront and Lambda@Edge functions',
        });
    },
    bootstrap,
  )
  .command('secrets', 'Create secrets in environment', () => null, secrets)
  .option('account', {
    alias: 'a',
    type: 'string',
    description: 'AWS account',
  })
  .option('region', {
    alias: 'r',
    type: 'string',
    default: process.env.AWS_REGION || 'us-west-2',
    description: 'AWS region to bootstrap',
  })
  .demandCommand()
  .help().argv;
