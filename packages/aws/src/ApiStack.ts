import {
  ApplicationLoadBalancer,
  Database,
  FargateService,
  RedisCluster,
} from '@disruptive-labs/aws';
import {
  aws_ec2 as ec2,
  aws_ecr as ecr,
  aws_ecs as ecs,
  aws_ecs_patterns as ecsPatterns,
  aws_events as events,
  aws_events_targets as targets,
  aws_rds as rds,
  aws_secretsmanager as secretsmanager,
  // aws_sqs as sqs,
  aws_stepfunctions as sfn,
  aws_stepfunctions_tasks as tasks,
  CfnParameter,
  Duration,
  RemovalPolicy,
  Stack,
  StackProps,
} from 'aws-cdk-lib';
import { Construct } from 'constructs';
import type { Config } from './config';

export interface ApiStackProps extends StackProps {
  config: Config;
  loadBalancer: ApplicationLoadBalancer;
  mail?: ecsPatterns.QueueProcessingFargateService;
  vpc: ec2.Vpc;
}

export class ApiStack extends Stack {
  public readonly role: FargateService['taskDefinition']['taskRole'];
  public readonly service: FargateService;

  constructor(
    scope: Construct,
    id: string,
    { config, loadBalancer, mail, vpc, ...props }: ApiStackProps,
  ) {
    super(scope, id, props);

    const databasePassword = new secretsmanager.Secret(this, 'DatabasePassword', {
      generateSecretString: {
        excludePunctuation: true,
      },
      removalPolicy: config.environment('production')
        ? RemovalPolicy.RETAIN
        : RemovalPolicy.DESTROY,
    });

    const database = new Database(this, 'Database', {
      instanceType: ec2.InstanceType.of(
        ec2.InstanceClass.T4G,
        config.environment('production') ? ec2.InstanceSize.MEDIUM : ec2.InstanceSize.MICRO,
      ),
      version: rds.PostgresEngineVersion.VER_12_10,
      caCertificate: rds.CaCertificate.RDS_CA_RDS2048_G1,
      databaseUsername: 'two',
      databasePassword: databasePassword.secretValue,
      databaseName: 'two',
      removalPolicy: config.environment('production')
        ? RemovalPolicy.RETAIN
        : RemovalPolicy.SNAPSHOT,
      vpc,
    });

    // const queue = new sqs.Queue(this, 'TaskQueue', {
    //   contentBasedDeduplication: true,
    //   deadLetterQueue: {
    //     queue: new sqs.Queue(this, 'TaskDeadLetterQueue', {
    //       contentBasedDeduplication: true,
    //       encryption: sqs.QueueEncryption.KMS_MANAGED,
    //       fifo: true,
    //       retentionPeriod: Duration.days(14),
    //     }),
    //     maxReceiveCount: 5,
    //   },
    //   encryption: sqs.QueueEncryption.KMS_MANAGED,
    //   fifo: true,
    //   visibilityTimeout: Duration.seconds(300),
    // });

    const store = new RedisCluster(this, 'Store', {
      cacheNodeType: config.environment('production') ? 'cache.t4g.medium' : 'cache.t4g.micro',
      vpc,
    });

    const securityGroup = new ec2.SecurityGroup(this, 'SecurityGroup', {
      allowAllOutbound: false,
      vpc,
    });

    // Allow container-to-container traffic
    securityGroup.connections.allowInternally(ec2.Port.allTcp());
    // Allow outgoing HTTP and NTP traffic
    securityGroup.connections.allowToAnyIpv4(ec2.Port.tcp(80));
    securityGroup.connections.allowToAnyIpv4(ec2.Port.udp(123));
    securityGroup.connections.allowToAnyIpv4(ec2.Port.tcp(443));
    // Allow traffic to database and redis
    securityGroup.connections.allowToDefaultPort(database);
    securityGroup.connections.allowToDefaultPort(store);

    const apiImageTag = new CfnParameter(this, 'apiImageTag', {
      type: 'String',
      description: 'ECR repository image tags to deploy',
      default: 'latest',
    });

    const apiContainerProps = {
      image: ecs.ContainerImage.fromEcrRepository(
        ecr.Repository.fromRepositoryName(this, 'Repository', 'api'),
        apiImageTag.valueAsString,
      ),
      environment: {
        NODE_ENV: config.environment(),
        PORT: '3000',
        API_DB_HOSTNAME: database.dbInstanceEndpointAddress,
        API_DB_USERNAME: 'two',
        API_DB_DATABASE: 'two',
        API_DB_PORT: database.dbInstanceEndpointPort,
        API_REDIS_URL: `redis://${store.clusterEndpointAddress}:${store.clusterEndpointPort}`,
        // API_TASKS_QUEUE_URL: queue.queueUrl,
        MAIL_QUEUE_URL: mail?.sqsQueue.queueUrl ?? '',
        WEB_URL: config.get('urls.web', ''),
      },
      secrets: {
        API_AUTH_SECRET: ecs.Secret.fromSecretsManager(
          new secretsmanager.Secret(this, 'ApiAuthSecret', {
            generateSecretString: {
              excludePunctuation: true,
              passwordLength: 64,
            },
          }),
        ),
        API_DB_PASSWORD: ecs.Secret.fromSecretsManager(databasePassword),
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
    };

    const minCapacity = config.environment('production') ? 2 : 1;

    this.service = new FargateService(this, 'ApiService', {
      cpu: 512,
      memoryLimitMiB: 1024,
      listenerPathPatterns: ['/api*'],
      listenerPriority: 5,
      healthCheck: {
        path: '/v1/health',
      },
      loadBalancer,
      minCapacity,
      maxCapacity: minCapacity * 4,
      securityGroups: [securityGroup],
      taskImageOptions: {
        ...apiContainerProps,
        runtimePlatform: {
          cpuArchitecture: ecs.CpuArchitecture.ARM64,
          operatingSystemFamily: ecs.OperatingSystemFamily.LINUX,
        },
        containerName: 'api',
        containerPort: 3000,
        enableLogging: true,
      },
      vpc,
    });

    this.role = this.service.taskDefinition.taskRole;

    // queue.grantConsumeMessages(this.role);
    // queue.grantSendMessages(this.role);

    if (mail) {
      mail.sqsQueue.grantSendMessages(this.role);
    }

    const workerTaskDef = new ecs.FargateTaskDefinition(this, 'ApiWorkerTaskDef', {
      cpu: 512,
      memoryLimitMiB: 1024,
      runtimePlatform: {
        cpuArchitecture: ecs.CpuArchitecture.ARM64,
        operatingSystemFamily: ecs.OperatingSystemFamily.LINUX,
      },
      taskRole: this.service.taskDefinition.taskRole,
    });

    workerTaskDef.addContainer('worker', {
      ...apiContainerProps,
      command: ['yarn', 'run', 'start-worker'],
      containerName: 'api-worker',
      logging: new ecs.AwsLogDriver({ streamPrefix: this.node.id }),
    });

    // new FargateService(this, 'ApiWorker', {
    //   cluster: this.service.cluster,
    //   taskDefinition: workerTaskDef,
    //   minCapacity: 1,
    //   maxCapacity: 2,
    //   securityGroups: [securityGroup],
    //   targetCpuUtilizationPercent: 0,
    //   targetMemoryUtilizationPercent: 0,
    //   vpc,
    // });

    const scheduledTasks: {
      id: string;
      schedule: events.Schedule;
      command: string[];
      timeout?: Duration;
    }[] = [];

    scheduledTasks.forEach(({ id, schedule, command, timeout }) => {
      const task = new tasks.EcsRunTask(this, `${id}Task`, {
        integrationPattern: sfn.IntegrationPattern.RUN_JOB,
        cluster: this.service.cluster,
        taskDefinition: workerTaskDef,
        containerOverrides: [
          {
            containerDefinition: workerTaskDef.findContainer('api-worker')!,
            command,
          },
        ],
        launchTarget: new tasks.EcsFargateLaunchTarget(),
        securityGroups: [securityGroup],
      });

      const stateMachine = new sfn.StateMachine(this, `${id}StateMachine`, {
        definition: task.addRetry({
          errors: [sfn.Errors.TASKS_FAILED],
          interval: Duration.seconds(15),
          maxAttempts: 3,
          backoffRate: 2,
        }),
        timeout: timeout || Duration.minutes(15),
      });

      new events.Rule(this, `${id}EventRule`, {
        schedule,
        targets: [new targets.SfnStateMachine(stateMachine)],
      });
    });
  }
}
