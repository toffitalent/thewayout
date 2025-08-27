import { apexDomain } from '@disruptive-labs/aws';
import {
  aws_certificatemanager as acm,
  aws_cloudfront as cloudfront,
  aws_cloudfront_origins as cloudfrontOrigins,
  aws_iam as iam,
  aws_route53 as route53,
  aws_route53_targets as route53Targets,
  aws_s3 as s3,
  Duration,
  RemovalPolicy,
  Stack,
  StackProps,
} from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Config, getHostname } from './config';

export interface UploadsStackProps extends StackProps {
  apiRole: iam.IRole;
  config: Config;
}

export class UploadsStack extends Stack {
  public readonly bucket: s3.IBucket;
  public readonly distribution: cloudfront.Distribution;

  constructor(scope: Construct, id: string, { apiRole, config, ...props }: UploadsStackProps) {
    super(scope, id, props);

    const bucketName = config.get('uploads.default.bucket', undefined);
    const domainName = getHostname(config.get('uploads.default.url'));

    this.bucket = new s3.Bucket(this, 'Bucket', {
      // Use pretty name if specified
      bucketName,
      cors: [
        {
          allowedHeaders: ['*'],
          allowedMethods: [
            s3.HttpMethods.GET,
            s3.HttpMethods.HEAD,
            s3.HttpMethods.POST,
            s3.HttpMethods.PUT,
          ],
          allowedOrigins: ['*'],
        },
      ],
      publicReadAccess: false,
      autoDeleteObjects: !config.environment('production'),
      removalPolicy: config.environment('production')
        ? RemovalPolicy.RETAIN
        : RemovalPolicy.DESTROY,
    });

    this.bucket.grantReadWrite(apiRole);

    const hostedZone = route53.HostedZone.fromLookup(this, 'HostedZone', {
      domainName: apexDomain(domainName),
    });

    const certificate = new acm.DnsValidatedCertificate(this, 'Certificate', {
      domainName,
      hostedZone,
      region: 'us-east-1',
    });

    this.distribution = new cloudfront.Distribution(this, 'Distribution', {
      certificate,
      domainNames: [domainName],
      defaultBehavior: {
        allowedMethods: cloudfront.AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
        cachedMethods: cloudfront.CachedMethods.CACHE_GET_HEAD_OPTIONS,
        cachePolicy: new cloudfront.CachePolicy(this, 'DefaultCachePolicy', {
          defaultTtl: Duration.seconds(604800),
          minTtl: Duration.seconds(1),
          maxTtl: Duration.seconds(31536000),
          enableAcceptEncodingBrotli: true,
          enableAcceptEncodingGzip: true,
          cookieBehavior: cloudfront.CacheCookieBehavior.none(),
          headerBehavior: cloudfront.CacheHeaderBehavior.none(),
          queryStringBehavior: cloudfront.CacheQueryStringBehavior.none(),
        }),
        origin: new cloudfrontOrigins.S3Origin(this.bucket),
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      },
      enableLogging: false,
      logBucket: undefined,
      logIncludesCookies: false,
      geoRestriction: cloudfront.GeoRestriction.denylist('CN', 'IR', 'KP', 'RU'),
    });

    new route53.ARecord(this, 'ARecord', {
      recordName: domainName,
      target: route53.RecordTarget.fromAlias(
        new route53Targets.CloudFrontTarget(this.distribution),
      ),
      zone: hostedZone,
    });

    new route53.AaaaRecord(this, 'AAAARecord', {
      recordName: domainName,
      target: route53.RecordTarget.fromAlias(
        new route53Targets.CloudFrontTarget(this.distribution),
      ),
      zone: hostedZone,
    });
  }
}
