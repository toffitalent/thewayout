export { config, config as default } from './config.js';
import { ConfigFactory } from './main.js';
export { ConfigOptions, init, load } from './main.js';
export { M as Manager } from './manager-Ci9xKh_o.js';

type Environment = 'development' | 'test' | 'staging' | 'production';
type EnvVarType = 'boolean' | 'json' | 'number' | 'string';
type ConfigValue = any;
type EnvironmentConfig = {
    [env in Environment]?: ConfigValue;
};
interface EnvConfig extends EnvironmentConfig {
    default?: ConfigValue;
    env?: string | {
        name: string;
        type: EnvVarType;
    };
}
type SelectedEnvConfig<C extends EnvConfig> = C['default'] & Partial<C['development'] & C['staging'] & C['production']>;
declare const env: <T extends EnvConfig>(envConfigOrEnvVarName: string | T, defaultValue?: any, optionalEnvVars?: Record<string, any>) => SelectedEnvConfig<T>;

declare const getCurrentEnv: () => string | undefined;

declare const CONFIG_REGISTRATION_KEY = "__CONFIG_REGISTRATION_KEY";

type ConfigFactoryReg = {
    [CONFIG_REGISTRATION_KEY]: string;
};
declare const register: <T extends ConfigFactory = ConfigFactory>(key: string, configFactory: T) => T & ConfigFactoryReg;

export { ConfigFactory, type ConfigFactoryReg, type EnvConfig, type EnvVarType, type Environment, env, getCurrentEnv, register };
