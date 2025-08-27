import { ApplicationLoadBalancer, Cdn, FargateService } from '@disruptive-labs/aws';
import {
  aws_cloudfront as cloudfront,
  aws_cloudfront_origins as cloudfrontOrigins,
  aws_ec2 as ec2,
  aws_ecr as ecr,
  aws_ecs as ecs,
  aws_s3_deployment as s3deploy,
  aws_secretsmanager as secretsmanager,
  CfnParameter,
  Duration,
  RemovalPolicy,
  Stack,
  StackProps,
} from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { resolve } from 'path';
import { Config } from './config';

export interface WebStackProps extends StackProps {
  config: Config;
  loadBalancer: ApplicationLoadBalancer;
  vpc: ec2.Vpc;
}

export class WebStack extends Stack {
  public readonly bucket: Cdn['bucket'];
  public readonly distribution: Cdn['distribution'];
  public readonly role: FargateService['taskDefinition']['taskRole'];
  public readonly service: FargateService;

  constructor(
    scope: Construct,
    id: string,
    { config, loadBalancer, vpc, ...props }: WebStackProps,
  ) {
    super(scope, id, props);

    const webImageTag = new CfnParameter(this, 'webImageTag', {
      type: 'String',
      description: 'ECR repository image tags to deploy',
      default: `latest-${config.environment()}`,
    });

    const minCapacity = config.environment('production') ? 2 : 1;

    this.service = new FargateService(this, 'WebService', {
      cpu: 512,
      memoryLimitMiB: 1024,
      minCapacity,
      maxCapacity: minCapacity * 4,
      loadBalancer,
      taskImageOptions: {
        image: ecs.ContainerImage.fromEcrRepository(
          ecr.Repository.fromRepositoryName(this, 'Repository', 'web'),
          webImageTag.valueAsString,
        ),
        runtimePlatform: {
          cpuArchitecture: ecs.CpuArchitecture.ARM64,
          operatingSystemFamily: ecs.OperatingSystemFamily.LINUX,
        },
        containerName: 'web',
        containerPort: 3000,
        enableLogging: true,
        environment: {
          NODE_ENV: 'production',
          APP_ENV: config.environment(),
          PORT: '3000',
          PUBLIC_URL: config.get('urls.web', ''),
        },
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
      },
      vpc,
    });

    this.role = this.service.taskDefinition.taskRole;

    const cdn = new Cdn(this, 'Cdn', {
      domainName: config.get('aws.hostnames.web', ''),
      httpHeaders: false,
      redirectSubdomains: [
        config.get<string>('aws.hostnames.web', '').startsWith('www')
          ? config.get<string>('aws.hostnames.web', '').replace(/^www\./, '')
          : `www.${config.get<string>('aws.hostnames.web', '')}`,
      ],
      removalPolicy: RemovalPolicy.DESTROY,
      websiteErrorDocument: 'index.html',
      websiteIndexDocument: 'index.html',
    });

    this.bucket = cdn.bucket;
    this.distribution = cdn.distribution;

    const origin = loadBalancer.getCloudFrontOrigin();

    this.distribution.addBehavior('/api*', origin, {
      allowedMethods: cloudfront.AllowedMethods.ALLOW_ALL,
      cachedMethods: cloudfront.CachedMethods.CACHE_GET_HEAD_OPTIONS,
      cachePolicy: cloudfront.CachePolicy.CACHING_DISABLED,
      originRequestPolicy: cloudfront.OriginRequestPolicy.ALL_VIEWER,
      viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
    });

    this.distribution.addBehavior('/_next/image*', origin, {
      allowedMethods: cloudfront.AllowedMethods.ALLOW_GET_HEAD,
      cachedMethods: cloudfront.CachedMethods.CACHE_GET_HEAD,
      cachePolicy: new cloudfront.CachePolicy(this, 'CachePolicyNextImage', {
        defaultTtl: Duration.seconds(60),
        minTtl: Duration.seconds(0),
        enableAcceptEncodingBrotli: true,
        enableAcceptEncodingGzip: true,
        cookieBehavior: cloudfront.CacheCookieBehavior.none(),
        headerBehavior: cloudfront.CacheHeaderBehavior.none(),
        queryStringBehavior: cloudfront.CacheQueryStringBehavior.all(),
      }),
      viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
    });

    this.distribution.addBehavior('/_next/static*', new cloudfrontOrigins.S3Origin(this.bucket), {
      allowedMethods: cloudfront.AllowedMethods.ALLOW_GET_HEAD,
      cachedMethods: cloudfront.CachedMethods.CACHE_GET_HEAD,
      cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
      viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
    });

    this.distribution.addBehavior('/*', origin, {
      allowedMethods: cloudfront.AllowedMethods.ALLOW_GET_HEAD,
      cachedMethods: cloudfront.CachedMethods.CACHE_GET_HEAD,
      cachePolicy: new cloudfront.CachePolicy(this, 'CachePolicy', {
        defaultTtl: Duration.seconds(0),
        minTtl: Duration.seconds(0),
        enableAcceptEncodingBrotli: true,
        enableAcceptEncodingGzip: true,
        cookieBehavior: cloudfront.CacheCookieBehavior.none(),
        headerBehavior: cloudfront.CacheHeaderBehavior.none(),
        queryStringBehavior: cloudfront.CacheQueryStringBehavior.none(),
      }),
      viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
    });

    if (config.get('aws.deploy.web', false)) {
      const deployment = new s3deploy.BucketDeployment(this, 'StaticDeployment', {
        sources: [
          s3deploy.Source.asset(resolve(__dirname, '../../web/build/static'), {
            exclude: ['*.map'],
          }),
        ],
        destinationBucket: this.bucket,
        destinationKeyPrefix: '_next/static',
        memoryLimit: 512,
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
