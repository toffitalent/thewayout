import { Config, getEnvId, loadConfig } from '..';

jest.mock('url', () => ({
  URL: jest.fn().mockImplementation(() => ({ hostname: 'example.com' })),
}));

const getApp = (env?: string, deploy?: string) => ({
  node: {
    tryGetContext: jest.fn().mockReturnValueOnce(env).mockReturnValueOnce(deploy),
  },
});

describe('config', () => {
  let config: Config;

  beforeEach(() => {
    const app = getApp('production');
    config = loadConfig(app as any);
  });

  describe('getEnvId()', () => {
    test('prefixes logical ID with environment', () => {
      expect(getEnvId('SomeStack')).toBe('Production-SomeStack');
    });
  });

  describe('getHostname()', () => {
    let getHostname!: any;

    beforeEach(() => {
      jest.isolateModules(() => {
        jest.unmock('url');
        // eslint-disable-next-line global-require
        ({ getHostname } = require('..'));
      });
    });

    test('returns hostname from URL', () => {
      expect(getHostname('https://www.example.com')).toBe('www.example.com');
    });

    test('throws on missing URL', () => {
      expect(() => getHostname('')).toThrow('Missing required URL config');
    });
  });

  describe('loadConfig()', () => {
    let processEnv: any;

    beforeEach(() => {
      processEnv = process.env;
    });

    afterEach(() => {
      process.env = processEnv;
    });

    test('loads configuration', () => {
      expect(config.get('aws')).toMatchSnapshot();
    });

    test('loads deployment info from context', () => {
      const app = getApp('production', 'true');
      const deployConfig = loadConfig(app as any);
      expect(deployConfig.get('aws')).toMatchSnapshot();
    });

    test('sets NODE_ENV if undefined', () => {
      process.env = {};
      const app = getApp('production');
      loadConfig(app as any);
      expect(process.env.NODE_ENV).toBe('production');
    });

    test('throws on missing env in context', () => {
      const app = getApp();
      expect(() => loadConfig(app as any)).toThrow(
        'Context env variable missing. Specify environment using the context option, e.g. `-c env=production`',
      );
    });

    test('throws on APP_ENV and context env mismatch', () => {
      process.env = { APP_ENV: 'staging' };
      const app = getApp('production');
      expect(() => loadConfig(app as any)).toThrow(
        `Env mismatch! APP_ENV is set to "staging" but env context is "production"`,
      );
    });
  });
});
