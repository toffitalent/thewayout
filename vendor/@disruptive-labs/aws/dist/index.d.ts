import { aws_elasticloadbalancingv2, aws_certificatemanager, aws_route53, aws_cloudfront_origins, aws_cloudfront, aws_lambda, aws_ecs, aws_ecs_patterns, Duration, aws_ec2, RemovalPolicy, aws_s3, aws_rds, SecretValue, aws_iam, aws_elasticache } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as apiGateway from '@aws-cdk/aws-apigatewayv2-alpha';
import sharp from 'sharp';
export { default as cspBuilder } from 'content-security-policy-builder';
export { apexDomain } from 'aws-cdk-lib/aws-certificatemanager';

interface ApplicationLoadBalancerProps extends aws_elasticloadbalancingv2.ApplicationLoadBalancerProps {
    certificate?: aws_certificatemanager.ICertificate;
    defaultAction?: aws_elasticloadbalancingv2.ListenerAction;
    dnsRecord?: boolean;
    domainName?: string;
    domainZone?: aws_route53.IHostedZone;
    listenerPort?: aws_elasticloadbalancingv2.ApplicationListenerProps['port'];
    openListener?: aws_elasticloadbalancingv2.ApplicationListenerProps['open'];
    protocol?: aws_elasticloadbalancingv2.ApplicationProtocol;
    redirectHTTP?: boolean;
    sslPolicy?: aws_elasticloadbalancingv2.ApplicationListenerProps['sslPolicy'];
    token?: string;
}
declare class ApplicationLoadBalancer extends aws_elasticloadbalancingv2.ApplicationLoadBalancer {
    readonly loadBalancer: aws_elasticloadbalancingv2.ApplicationLoadBalancer;
    readonly loadBalancerDomainName: string;
    readonly token: string | undefined;
    readonly listener: aws_elasticloadbalancingv2.ApplicationListener;
    readonly redirectListener?: aws_elasticloadbalancingv2.ApplicationListener;
    constructor(scope: Construct, id: string, { certificate: certificateProp, defaultAction, dnsRecord, domainName, domainZone: domainZoneProp, listenerPort, openListener, protocol, redirectHTTP, sslPolicy, token, ...props }: ApplicationLoadBalancerProps);
    getCloudFrontOrigin(props?: aws_cloudfront_origins.HttpOriginProps): aws_cloudfront_origins.HttpOrigin;
    getTokenListenerCondition(): aws_elasticloadbalancingv2.ListenerCondition | undefined;
    getTokenHeaders(): Record<string, string> | undefined;
}

declare enum LogLevel {
    'none' = 0,
    'error' = 10,
    'warn' = 20,
    'info' = 30,
    'debug' = 40
}

type Config<T> = T & {
    logLevel?: keyof typeof LogLevel;
};

interface HttpHeadersProps extends Omit<aws_cloudfront.experimental.EdgeFunctionProps, 'code' | 'handler' | 'runtime'> {
    httpHeaders?: Record<string, string>;
    logLevel?: keyof typeof LogLevel;
}
declare class HttpHeaders extends aws_cloudfront.experimental.EdgeFunction {
    constructor(scope: Construct, id: string, { httpHeaders, logLevel, ...props }?: HttpHeadersProps);
}

declare const statusCodes: {
    301: string;
    302: string;
    307: string;
};
type RedirectConfig = Config<{
    redirectPatterns: Record<string, string | {
        to: string;
        statusCode: keyof typeof statusCodes;
    }>;
}>;

interface RedirectProps extends RedirectConfig, Omit<aws_cloudfront.experimental.EdgeFunctionProps, 'code' | 'handler' | 'runtime'> {
    logLevel?: keyof typeof LogLevel;
}
declare class Redirect extends aws_cloudfront.experimental.EdgeFunction {
    constructor(scope: Construct, id: string, { logLevel, redirectPatterns, ...props }: RedirectProps);
}

interface RequestUriProps extends Omit<aws_cloudfront.experimental.EdgeFunctionProps, 'code' | 'handler' | 'runtime'> {
    defaultRewritePath?: string;
    enableDefaultRewrite?: boolean;
    rewritePaths?: Record<string, string>;
    rewritePatterns?: Record<string, string>;
    logLevel?: keyof typeof LogLevel;
}
declare class RequestUri extends aws_cloudfront.experimental.EdgeFunction {
    constructor(scope: Construct, id: string, { defaultRewritePath, enableDefaultRewrite, logLevel, rewritePaths, rewritePatterns, ...props }?: RequestUriProps);
}

type WordpressConfig = Config<{
    redirects?: string[];
    origin: string;
    url: string;
}>;

interface WordpressRequestProps extends WordpressConfig, Omit<aws_cloudfront.experimental.EdgeFunctionProps, 'code' | 'handler' | 'runtime'> {
    logLevel?: keyof typeof LogLevel;
}
declare class WordpressRequest extends aws_cloudfront.experimental.EdgeFunction {
    constructor(scope: Construct, id: string, { logLevel, redirects, origin, url, ...props }: WordpressRequestProps);
}

interface WordpressResponseProps extends WordpressConfig, Omit<aws_cloudfront.experimental.EdgeFunctionProps, 'code' | 'handler' | 'runtime'> {
    logLevel?: keyof typeof LogLevel;
}
declare class WordpressResponse extends aws_cloudfront.experimental.EdgeFunction {
    constructor(scope: Construct, id: string, { logLevel, redirects, origin, url, ...props }: WordpressResponseProps);
}

type ImageResizeConfig = Config<{
    allowedDimensions?: string[];
    allowedFormats?: (keyof sharp.FormatEnum)[];
    cacheControlMaxAge?: number;
    cacheControlSMaxAge?: number;
    defaultDimension?: string;
    defaultFormat?: keyof sharp.FormatEnum;
    defaultQuality?: number;
    defaultMode?: keyof sharp.FitEnum;
    bucketName?: string;
    keyPrefix?: string;
    maxHeight?: number;
    maxQuality?: number;
    maxWidth?: number;
}>;

declare const ImageResizeQueryParams: readonly ["f", "m", "q", "s", "w", "h"];
interface ImageResizeProps extends Omit<aws_lambda.FunctionProps, 'code' | 'handler' | 'runtime'>, ImageResizeConfig {
}
declare class ImageResize extends aws_lambda.Function {
    constructor(scope: Construct, id: string, { allowedDimensions, allowedFormats, cacheControlMaxAge, cacheControlSMaxAge, defaultDimension, defaultFormat, defaultQuality, defaultMode, bucketName, keyPrefix, logLevel, maxHeight, maxQuality, maxWidth, ...props }: ImageResizeProps);
}

interface LoadBalancedFargateServiceProps extends Omit<aws_ecs_patterns.ApplicationLoadBalancedFargateServiceProps, 'vpc'> {
    loadBalancerToken?: string;
    deregistrationDelay?: Duration;
    healthCheck?: aws_elasticloadbalancingv2.HealthCheck | boolean;
    healthCheckPath?: string;
    healthCheckPort?: string;
    scalingCpuTarget?: number | false;
    scalingMemoryTarget?: number | false;
    scalingMax?: number | false;
    vpc: aws_ec2.IVpc;
}
declare class LoadBalancedFargateService extends Construct {
    readonly loadBalancerDomainName?: string;
    readonly loadBalancerToken?: string;
    readonly assignPublicIp: boolean;
    readonly cluster: aws_ecs.ICluster;
    readonly loadBalancer: aws_elasticloadbalancingv2.IApplicationLoadBalancer | ApplicationLoadBalancer;
    readonly service: aws_ecs.FargateService;
    readonly taskDefinition: aws_ecs.TaskDefinition;
    readonly targetGroup: aws_elasticloadbalancingv2.ApplicationTargetGroup;
    constructor(scope: Construct, id: string, { loadBalancerToken, assignPublicIp, deregistrationDelay, domainName, desiredCount, healthCheck, healthCheckPath, healthCheckPort, loadBalancer: loadBalancerProp, protocol, scalingCpuTarget, scalingMemoryTarget, scalingMax, vpc, ...props }: LoadBalancedFargateServiceProps);
}

interface ApiBehaviorProps {
    allowedHeaders?: string[];
    cachePolicy?: aws_cloudfront.CachePolicy;
    domainName?: string;
    loadBalancer?: aws_elasticloadbalancingv2.ApplicationLoadBalancer;
    loadBalancerToken?: string;
    origin?: aws_cloudfront.IOrigin;
    pathPattern?: string;
}
interface CdnProps {
    certificate?: aws_certificatemanager.ICertificate;
    domainName: string;
    edgeLambdas?: aws_cloudfront.EdgeLambda[];
    enableLogging?: boolean;
    httpHeaders?: HttpHeaders | false;
    hostedZone?: aws_route53.IHostedZone;
    redirectSubdomains?: string[];
    removalPolicy?: RemovalPolicy;
    websiteErrorDocument?: string;
    websiteIndexDocument?: string;
    websiteRoutingRules?: aws_s3.RoutingRule[];
}
declare class Cdn extends Construct {
    readonly bucket: aws_s3.Bucket;
    readonly distribution: aws_cloudfront.Distribution;
    addBehavior: aws_cloudfront.Distribution['addBehavior'];
    constructor(scope: Construct, id: string, props: CdnProps);
    addLoadBalancerBehavior(props: LoadBalancedFargateService | ApplicationLoadBalancer | aws_elasticloadbalancingv2.ApplicationLoadBalancer | ApiBehaviorProps): void;
}

interface DatabaseProps extends Omit<aws_rds.DatabaseInstanceProps, 'engine'> {
    engine?: aws_rds.IInstanceEngine;
    databaseName?: string;
    databasePassword?: SecretValue;
    databaseUsername?: string;
    version?: aws_rds.PostgresEngineVersion;
}
declare class Database extends aws_rds.DatabaseInstance {
    constructor(scope: Construct, id: string, { databasePassword, databaseUsername, removalPolicy: removalPolicyProp, storageEncryptionKey: storageEncryptionKeyProp, version, ...props }: DatabaseProps);
}

interface FargateServiceTaskImageOptions {
    readonly image: aws_ecs.ContainerImage;
    readonly environment?: {
        [key: string]: string;
    };
    readonly secrets?: {
        [key: string]: aws_ecs.Secret;
    };
    readonly enableLogging?: boolean;
    readonly logDriver?: aws_ecs.LogDriver;
    readonly executionRole?: aws_iam.IRole;
    readonly runtimePlatform?: aws_ecs.FargateTaskDefinitionProps['runtimePlatform'];
    readonly taskRole?: aws_iam.IRole;
    readonly containerName?: string;
    readonly containerPort?: number;
    readonly family?: string;
    readonly dockerLabels?: {
        [key: string]: string;
    };
}
interface FargateServiceProps extends Omit<aws_ecs.FargateServiceProps, 'cluster' | 'desiredCount' | 'taskDefinition'> {
    cluster?: aws_ecs.ICluster;
    cpu?: aws_ecs.FargateTaskDefinitionProps['cpu'];
    memoryLimitMiB?: aws_ecs.FargateTaskDefinitionProps['memoryLimitMiB'];
    maxCapacity?: number;
    minCapacity: number;
    targetCpuUtilizationPercent?: number;
    targetMemoryUtilizationPercent?: number;
    taskDefinition?: aws_ecs.FargateTaskDefinition;
    taskImageOptions?: FargateServiceTaskImageOptions;
    vpc: aws_ec2.IVpc;
    healthCheck?: aws_elasticloadbalancingv2.HealthCheck;
    listener?: aws_elasticloadbalancingv2.ApplicationListener;
    listenerConditions?: aws_elasticloadbalancingv2.ListenerCondition[];
    listenerPathPatterns?: string[];
    listenerPriority?: number;
    loadBalancer?: ApplicationLoadBalancer;
    targetGroup?: aws_elasticloadbalancingv2.IApplicationTargetGroup;
}
declare class FargateService extends aws_ecs.FargateService {
    readonly scalableTarget: aws_ecs.ScalableTaskCount;
    constructor(scope: Construct, id: string, { cluster: clusterProp, cpu, healthCheck, listener: listenerProp, listenerConditions, listenerPathPatterns, listenerPriority, loadBalancer, maxCapacity, minCapacity, memoryLimitMiB, targetCpuUtilizationPercent, targetMemoryUtilizationPercent, targetGroup: targetGroupProp, taskDefinition: taskDefinitionProp, taskImageOptions, vpc, ...props }: FargateServiceProps);
    protected static getDefaultCluster(scope: Construct, vpc: aws_ec2.IVpc): aws_ecs.Cluster;
}

interface HttpsRedirectProps extends Omit<aws_cloudfront.DistributionProps, 'defaultBehavior' | 'domainNames'> {
    readonly zone: aws_route53.IHostedZone;
    readonly targetDomain: string;
    readonly recordNames?: string[];
    readonly certificate?: aws_certificatemanager.ICertificate;
    edgeLambdas?: aws_cloudfront.EdgeLambda[];
}
declare class HttpsRedirect extends Construct {
    constructor(scope: Construct, id: string, { certificate: certificateProp, edgeLambdas, recordNames, targetDomain, zone, ...props }: HttpsRedirectProps);
}

interface ImageProxyProps {
    bucketName?: string;
    behaviors?: Record<string, Omit<ImageResizeProps, 'bucket'>>;
    cachePolicy?: aws_cloudfront.CachePolicy;
    certificate?: aws_certificatemanager.Certificate;
    defaultBehavior?: Omit<ImageResizeProps, 'bucket'>;
    domainName: string;
    hostedZone?: aws_route53.HostedZone;
    removalPolicy?: RemovalPolicy;
}
declare class ImageProxy extends Construct {
    readonly api: apiGateway.HttpApi;
    readonly bucket: aws_s3.IBucket;
    readonly distribution: aws_cloudfront.Distribution;
    constructor(scope: Construct, id: string, { behaviors, bucketName, cachePolicy: cachePolicyProp, certificate: certificateProp, defaultBehavior, domainName, hostedZone: hostedZoneProp, removalPolicy, }: ImageProxyProps);
}

interface RedisClusterProps {
    cacheNodeType?: string;
    engineVersion?: string;
    numCacheNodes?: number;
    preferredMaintenanceWindow?: string;
    securityGroup?: aws_ec2.SecurityGroup;
    subnetIds?: string[];
    vpc?: aws_ec2.Vpc;
}
declare class RedisCluster extends Construct implements aws_ec2.IConnectable {
    readonly cluster: aws_elasticache.CfnCacheCluster;
    readonly clusterEndpointAddress: string;
    readonly clusterEndpointPort: string;
    readonly connections: aws_ec2.Connections;
    readonly securityGroup: aws_ec2.SecurityGroup;
    constructor(scope: Construct, id: string, props: RedisClusterProps);
}

declare const codeAssetWithConfig: (assetPath: string, config: Record<string, any>, image?: boolean) => aws_lambda.AssetImageCode | aws_lambda.AssetCode;

declare const inlineAsset: (filepath: string, code: string) => aws_lambda.AssetCode;

declare const getHash: (str: string) => string;

export { type ApiBehaviorProps, ApplicationLoadBalancer, type ApplicationLoadBalancerProps, Cdn, type CdnProps, Database, type DatabaseProps, FargateService, type FargateServiceProps, type FargateServiceTaskImageOptions, HttpHeaders, type HttpHeadersProps, HttpsRedirect, type HttpsRedirectProps, ImageProxy, type ImageProxyProps, ImageResize, type ImageResizeProps, ImageResizeQueryParams, LoadBalancedFargateService, type LoadBalancedFargateServiceProps, Redirect, type RedirectProps, RedisCluster, type RedisClusterProps, RequestUri, type RequestUriProps, WordpressRequest, type WordpressRequestProps, WordpressResponse, type WordpressResponseProps, codeAssetWithConfig, getHash, inlineAsset };
