import chalk from 'chalk';
import { execSync } from 'child_process';

// TODO: Creating a global ECR repository outside of the CDK is not idiomatic, but until
// a better solution is found (or built), it is the only way to avoid having to build
// and push docker images during every CDK deployment
//
// Related issues:
// https://github.com/aws/aws-cdk/issues/8565
// https://github.com/aws/aws-cdk/issues/12597
// https://github.com/aws/aws-cdk/issues/1559

export const defaults = {
  repositories: ['api', 'mail', 'web'],
  repositoryLifecyclePolicy: {
    rules: [
      {
        rulePriority: 5,
        description: 'Expire untagged images',
        selection: {
          tagStatus: 'untagged',
          countType: 'imageCountMoreThan',
          countNumber: 1,
        },
        action: {
          type: 'expire',
        },
      },
      {
        rulePriority: 10,
        description: 'Limit image count',
        selection: {
          tagStatus: 'any',
          countType: 'imageCountMoreThan',
          countNumber: 20,
        },
        action: {
          type: 'expire',
        },
      },
    ],
  },
};

export const getGroupPolicy = (account: string, region: string, repositories: string[]) => ({
  Version: '2012-10-17',
  Statement: [
    {
      Action: 'ecr:GetAuthorizationToken',
      Effect: 'Allow',
      Resource: '*',
    },
    {
      Action: [
        'ecr:PutImage',
        'ecr:InitiateLayerUpload',
        'ecr:UploadLayerPart',
        'ecr:CompleteLayerUpload',
        'ecr:BatchCheckLayerAvailability',
        'ecr:DescribeRepositories',
        'ecr:DescribeImages',
      ],
      Effect: 'Allow',
      Resource: repositories.map(
        (repository) => `arn:aws:ecr:${region}:${account}:repository/${repository}`,
      ),
    },
    {
      Action: 'ec2:DescribeAvailabilityZones',
      Effect: 'Allow',
      Resource: '*',
    },
    {
      Action: 'route53:ListHostedZonesByName',
      Effect: 'Allow',
      Resource: '*',
    },
    {
      Action: 'sts:AssumeRole',
      Effect: 'Allow',
      Resource: ['arn:*:iam::*:role/*-deploy-role-*', 'arn:*:iam::*:role/*-publishing-role-*'],
    },
  ],
});

export const bootstrap = (argv: any) => {
  const { cfRegion = true, environment, region, repos } = argv;
  let { account } = argv;

  if (!account) {
    account = execSync('aws sts get-caller-identity --query Account --output text')
      .toString()
      .trim();
  }

  const regions = [region, cfRegion && region !== 'us-east-1' && 'us-east-1']
    .filter(Boolean)
    .map((r) => `aws://${account}/${r}`);

  console.log(`${chalk.blue('info')} Bootstrapping regions: ${regions.join(', ')}`);

  try {
    execSync(
      `AWS_ACCOUNT=${account} ./node_modules/.bin/cdk bootstrap -c env=${environment} ${regions.join(
        ' ',
      )}`,
      { stdio: ['ignore', 'ignore', 'pipe'] },
    );
  } catch (err) {
    console.error(`${chalk.red('error')} Bootstrapping failed`, err);
    return;
  }

  // Create deploy group
  try {
    console.log(`${chalk.blue('info')} Checking for ${chalk.bold('deploy')} IAM group`);
    execSync('aws iam get-group --group-name deploy', { stdio: 'ignore' });
    console.log(`${chalk.blue('info')} IAM group ${chalk.bold('deploy')} found, not creating`);
  } catch (err) {
    // Not found, so create
    console.log(`${chalk.blue('info')} Creating IAM group ${chalk.bold('deploy')}`);

    execSync('aws iam create-group --group-name deploy');
    const policy = execSync(
      `aws iam create-policy --policy-name deploy --policy-document '${JSON.stringify(
        getGroupPolicy(account, region, repos),
      )}'`,
    ).toString();
    execSync(
      `aws iam attach-group-policy --group-name deploy --policy-arn ${
        JSON.parse(policy).Policy.Arn
      }`,
    );

    console.log(`${chalk.blue('info')} IAM group ${chalk.bold('deploy')} created`);
  }

  // Create repositories
  repos.forEach((repository: string) => {
    try {
      console.log(
        `${chalk.blue('info')} Creating ECR repository ${chalk.bold(
          repository,
        )} in region ${region}`,
      );

      execSync(`aws ecr create-repository --region ${region} --repository-name ${repository}`);
      execSync(
        `aws ecr put-lifecycle-policy --region ${region} --repository-name ${repository} --lifecycle-policy-text '${JSON.stringify(
          defaults.repositoryLifecyclePolicy,
        )}'`,
      );

      console.log(`${chalk.blue('info')} ECR repository ${chalk.bold(repository)} created`);
    } catch (err) {
      console.log(
        `${chalk.red('error')} Failed to create ECR repository ${chalk.bold(repository)}`,
      );
    }
  });

  console.log(`${chalk.green('success')} Bootstrapped regions: ${regions.join(', ')}`);
  console.log(`${chalk.blue('info')} Use the "secrets" command to add required secret values`);
};
