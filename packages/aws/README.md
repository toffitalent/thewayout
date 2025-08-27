# @two/aws

Copyright (c) 2023-Present The Way Out, Inc. All Rights Reserved.

## Bootstrapping

Before resources can be deployed to AWS, relevant environments must be [bootstrapped](https://docs.aws.amazon.com/cdk/latest/guide/bootstrapping.html). This process creates a CloudFormation stack in each region specified, which creates some base resources like IAM roles. Additionally, the custom bootstrap script in this package extends the default CDK bootstrapping by also creating a couple of resources that aren't managed by the CDK: (1) a `deploy` IAM group with permissions to push/pull ECR images and deploy the CDK, and (2) an ECR repository for the API package. Additionally, it will automatically bootstrap both the specified region (or us-west-2 by default) and the us-east-1 region (required for Lambda@Edge resources).

To bootstrap, make sure you are using AWS credentials (or a profile) with administrator access and run the bootstrap script:

```shell
yarn workspace @two/aws bootstrap
```

Once complete, the specified (or default) regions are bootstrapped, and admin credentials are no longer required. To grant deployment permissions to other IAM users, simply add them to the `deploy` IAM group created by the bootstrapping process. The group policy provides all the access necessary to deploy the CDK.

**NOTE: Be mindful of the powerful permissions the `deploy` group can access. ONLY GRANT ACCESS TO TRUSTED USERS and keep credentials safe!**

The CDK synthesizing and bootstrapping process should also have produced a `cdk.context.json` file. This file contains CDK context (e.g. availability zones and Route53 hosted zone details) that keeps deployments consistent. It should be committed to version control once generated and whenever modified.

### Secrets

The bootstrapping script will also remind you to run the secrets script, which will prompt you for the values of various secrets that are supplied to containers and infrastructure. These secrets include things like a SendGrid API key, used to connect to SendGrid and send emails. These values will be stored in AWS Secrets Manager.

Simply supply the required values to the script and they will be automatically provided to running containers as environment variables. To add additional secrets, update the secrets config file in the config folder. Then, just run the secrets script again. The script can be run as many times and as often as needed, though containers may need to be relaunched to pick up the new values.

## Initial Deployment

To avoid any race conditions or CloudFormation errors, it is recommended to do the initial CDK deployment manually before enabling the continuous deployment jobs in CircleCI. Using an IAM profile that is part of the `deploy` group (or one with administrator access if preferred), build the relevant packages and run the initial deployment:

```shell
export AWS_ACCOUNT=$(aws sts get-caller-identity --query Account --output text)
export AWS_REGION=us-west-2

# Build TypeScript
yarn clean
yarn workspace @two/aws build

# Build images
docker buildx create --use
docker buildx build --platform=linux/arm64 --build-arg NODE_ENV=production --build-arg APP_ENV=production --build-arg VERSION=$(git rev-parse HEAD) --secret id=NPM_TOKEN --secret id=SENTRY_AUTH_TOKEN -f ./packages/api/Dockerfile -t $AWS_ACCOUNT.dkr.ecr.$AWS_REGION.amazonaws.com/api:latest --load .
docker buildx build --platform=linux/arm64 --build-arg NODE_ENV=production --build-arg APP_ENV=production --build-arg VERSION=$(git rev-parse HEAD) --secret id=NPM_TOKEN --secret id=SENTRY_AUTH_TOKEN -f ./packages/mail/Dockerfile -t $AWS_ACCOUNT.dkr.ecr.$AWS_REGION.amazonaws.com/mail:latest --load .
docker buildx build --platform=linux/arm64 --build-arg NODE_ENV=production --build-arg APP_ENV=production --build-arg VERSION=$(git rev-parse HEAD) --secret id=NPM_TOKEN --secret id=SENTRY_AUTH_TOKEN -f ./packages/web/Dockerfile -t $AWS_ACCOUNT.dkr.ecr.$AWS_REGION.amazonaws.com/web:latest-production --load .

# Push images to ECR repositories
aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $AWS_ACCOUNT.dkr.ecr.$AWS_REGION.amazonaws.com
docker push $AWS_ACCOUNT.dkr.ecr.$AWS_REGION.amazonaws.com/api:latest
docker push $AWS_ACCOUNT.dkr.ecr.$AWS_REGION.amazonaws.com/mail:latest
docker push $AWS_ACCOUNT.dkr.ecr.$AWS_REGION.amazonaws.com/web:latest-production

# Extract static assets
docker create --name mail-assets $AWS_ACCOUNT.dkr.ecr.$AWS_REGION.amazonaws.com/mail:latest
docker create --name web-assets $AWS_ACCOUNT.dkr.ecr.$AWS_REGION.amazonaws.com/web:latest-production
docker cp mail-assets:/app/packages/mail/build ./packages/mail/build
docker cp web-assets:/app/packages/web/build ./packages/web/build

# Deploy
yarn workspace @two/aws deploy:prod -c deploy=true --all --require-approval never
```

The stacks can take a while to deploy, but once complete, everything should be up and running on the configured domain(s). The commands above can be tweaked to deploy additional environments as well (e.g. staging), just be sure all required configuration values are present in each package.

## Continuous Deployment

The CircleCI configuration includes the ability to deploy the application to both staging and production environments automatically, following successful test runs. The behavior is disabled initially, as the above bootstrapping and initial deployment steps should be completed before enabling CircleCI deploys.

Once the basic environment(s) are up and running, (1) add the CircleCI AWS user to the `deploy` IAM group, or create one if one doesn't exist, (2) add the AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY environment variables to a CircleCI context, using the values provided by AWS, and (3) uncomment the deploy jobs in `.circleci/config.yml` and replace the `AWS_CREDENTIALS_CONTEXT` placeholder with the name of the CircleCI context created in Step 2.

Changes to packages with AWS infrastructure, including `packages/aws` itself, will now be automatically deployed after each commit that passes testing. **Be sure to restrict access to the master branch in GitHub** so that only trusted users (if any) can commit directly as those changes will be deployed with no further review. Most changes should go through a pull request and review process to minimize the risk dangerous modifications to AWS configuration.

## Considerations

### Pricing

The default resources provisioned have a monthly cost of around $250 per environment (i.e. $500 for production and staging), not including additional data transfer costs. This assumes the purchase of no-upfront reserved instances/nodes for the API database in RDS and the Redis instances in ElastiCache, as well as subscribing to a compute savings plan for the ECS Fargate resources. The NAT Gateway instances in each private VPC subnet contribute significantly to the overall monthly cost - if resources do not require non-load balancer access to the internet, these should be eliminated for a substantial savings.

### Notes

- Only one instance of a particular environment can be created in each AWS region (i.e. you can only have one "production" and one "staging" setup in a particular AWS region). To create another environment, use a different region, or configure another environment, e.g. "beta".
