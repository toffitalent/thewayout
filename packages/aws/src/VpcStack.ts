import { apexDomain, ApplicationLoadBalancer } from '@disruptive-labs/aws';
import { aws_ec2 as ec2, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import type { Config } from './config';

export interface VpcStackProps extends StackProps {
  config: Config;
}

export class VpcStack extends Stack {
  public readonly loadBalancer: ApplicationLoadBalancer;
  public readonly vpc: ec2.Vpc;

  constructor(scope: Construct, id: string, { config, ...props }: VpcStackProps) {
    super(scope, id, props);

    this.vpc = new ec2.Vpc(this, 'VPC', {
      natGateways: config.environment('production') ? 2 : 1,
      maxAzs: 2,
    });

    this.vpc.addGatewayEndpoint('S3', {
      service: ec2.GatewayVpcEndpointAwsService.S3,
    });

    this.loadBalancer = new ApplicationLoadBalancer(this, 'LB', {
      domainName: `origin.${apexDomain(config.get('aws.hostnames.web', ''))}`,
      token: '34e59962ce62b4c9d7bde5275caf38c4',
      vpc: this.vpc,
    });
  }
}
