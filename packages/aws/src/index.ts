import { App, Tags } from 'aws-cdk-lib';
import { ApiStack } from './ApiStack';
import { getEnvId, loadConfig } from './config';
import { MailStack } from './MailStack';
import { UploadsStack } from './UploadsStack';
import { VpcStack } from './VpcStack';
import { WebStack } from './WebStack';

const app = new App();
const config = loadConfig(app);

const env = {
  account: config.get('aws.account'),
  region: config.get('aws.region'),
};

Tags.of(app).add('app_env', config.environment());
Tags.of(app).add('app_domain', config.get('aws.hostnames.web', ''));

const { loadBalancer, vpc } = new VpcStack(app, getEnvId('VpcStack'), { config, env });
const { mail } = new MailStack(app, getEnvId('MailStack'), { config, env, vpc });
const api = new ApiStack(app, getEnvId('ApiStack'), { config, env, loadBalancer, mail, vpc });
const web = new WebStack(app, getEnvId('WebStack'), { config, env, loadBalancer, vpc });
new UploadsStack(app, getEnvId('UploadsStack'), { apiRole: api.role, config, env });

// Deploy API before frontend
web.addDependency(api);

app.synth();
