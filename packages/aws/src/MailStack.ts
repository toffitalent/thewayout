import { Cdn } from '@disruptive-labs/aws';
import {
  aws_ec2 as ec2,
  aws_ecr as ecr,
  aws_ecs as ecs,
  aws_ecs_patterns as ecsPatterns,
  aws_iam as iam,
  aws_s3_deployment as s3deploy,
  aws_secretsmanager as secretsmanager,
  aws_sqs as sqs,
  CfnParameter,
  Duration,
  RemovalPolicy,
  Stack,
  StackProps,
} from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { resolve } from 'path';
import type { Config } from './config';

export interface MailStackProps extends StackProps {
  config: Config;
  vpc: ec2.Vpc;
}

export class MailStack extends Stack {
  public readonly mail: ecsPatterns.QueueProcessingFargateService;
  public readonly role: ecsPatterns.QueueProcessingFargateService['taskDefinition']['taskRole'];
  public readonly service: ecs.FargateService;
  public readonly deadLetterQueue: sqs.Queue;
  public readonly queue: sqs.Queue;
  public readonly bucket: Cdn['bucket'];
  public readonly distribution: Cdn['distribution'];

  constructor(scope: Construct, id: string, { config, vpc, ...props }: MailStackProps) {
    super(scope, id, props);

    const mailImageTag = new CfnParameter(this, 'mailImageTag', {
      type: 'String',
      description: 'ECR repository image tags to deploy',
      default: 'latest',
    });

    this.deadLetterQueue = new sqs.Queue(this, 'DeadLetterQueue', {
      encryption: sqs.QueueEncryption.KMS_MANAGED,
      fifo: true,
      retentionPeriod: Duration.days(14),
    });

    this.queue = new sqs.Queue(this, 'Queue', {
      deadLetterQueue: {
        queue: this.deadLetterQueue,
        maxReceiveCount: 5,
      },
      encryption: sqs.QueueEncryption.KMS_MANAGED,
      fifo: true,
      visibilityTimeout: Duration.seconds(60),
    });

    this.mail = new ecsPatterns.QueueProcessingFargateService(this, 'MailService', {
      queue: this.queue,
      image: ecs.ContainerImage.fromEcrRepository(
        ecr.Repository.fromRepositoryName(this, 'Repository', 'mail'),
        mailImageTag.valueAsString,
      ),
      runtimePlatform: {
        cpuArchitecture: ecs.CpuArchitecture.ARM64,
        operatingSystemFamily: ecs.OperatingSystemFamily.LINUX,
      },
      cpu: 256,
      enableLogging: true,
      environment: {
        NODE_ENV: config.environment(),
        MAIL_QUEUE_URL: this.queue.queueUrl,
        MAIL_URL: config.get('urls.mail', ''),
        WEB_URL: config.get('urls.web', ''),
      },
      memoryLimitMiB: 512,
      maxScalingCapacity: 2,
      minScalingCapacity: 1,
      secrets: {
        ...Object.keys(config.get('aws.secrets', {})).reduce(
          (secrets, name) => ({
            ...secrets,
            [config.get(`aws.secrets.${name}.env`)]: ecs.Secret.fromSecretsManager(
              secretsmanager.Secret.fromSecretNameV2(this, name, name),
            ),
          }),
          {},
        ),
      },
      vpc,
    });

    this.role = this.mail.taskDefinition.taskRole;
    this.service = this.mail.service;

    this.role.addToPrincipalPolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: ['ses:SendEmail', 'ses:SendRawEmail', 'ses:SendTemplatedEmail'],
        resources: ['*'],
      }),
    );

    // Static mail assets
    const cdn = new Cdn(this, 'Cdn', {
      domainName: config.get('aws.hostnames.mail', ''),
      enableLogging: false,
      httpHeaders: false,
      removalPolicy: RemovalPolicy.DESTROY,
    });

    this.bucket = cdn.bucket;
    this.distribution = cdn.distribution;

    if (config.get('aws.deploy.mail', false)) {
      const deployment = new s3deploy.BucketDeployment(this, 'MailAssetsDeployment', {
        sources: [
          s3deploy.Source.asset(resolve(__dirname, '../../mail/build/dist/assets'), {
            exclude: ['*.map'],
          }),
        ],
        destinationBucket: this.bucket,
        destinationKeyPrefix: 'assets',
        memoryLimit: 256,
        prune: false,
        retainOnDelete: true,
        cacheControl: [
          s3deploy.CacheControl.setPublic(),
          s3deploy.CacheControl.maxAge(Duration.seconds(31536000)),
          s3deploy.CacheControl.fromString('immutable'),
        ],
      });

      this.service.node.addDependency(deployment);
    }
  }
}
