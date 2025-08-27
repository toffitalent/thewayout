import { M as Manager } from './manager-Ci9xKh_o.js';

type ConfigFactoryReturnValue = Record<string, any>;
type ConfigFactory<T extends ConfigFactoryReturnValue = ConfigFactoryReturnValue> = (envVars: Record<string, any>) => T;
interface ConfigOptions {
    envFilePath?: string | string[];
    expandVariables?: boolean;
    ignoreEnvFile?: boolean;
    ignoreEnvSpecificFiles?: boolean;
    load?: ConfigFactory[];
    validate?: <T extends Record<string, any>>(config: T) => T;
}
declare const init: (options?: ConfigOptions) => Manager<Record<string, any>>;
declare const load: (key: string, configFactories: ConfigFactory | ConfigFactory[]) => Manager<Record<string, any>>;

export { type ConfigFactory, type ConfigOptions, init, load };
