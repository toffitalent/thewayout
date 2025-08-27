describe('config', () => {
  let processEnv: any;

  beforeEach(() => {
    processEnv = process.env;
  });

  afterEach(() => {
    process.env = processEnv;
  });

  test('initializes global config', () => {
    process.env = { NODE_ENV: 'test', SOME_VAR: 'true', IGNORE_ENV_FILES: 'true' };
    const { default: config } = require('..');
    expect(config).toMatchSnapshot();
  });

  test('initializes development environment config', () => {
    process.env = { NODE_ENV: 'development', IGNORE_ENV_FILES: 'true' };
    const { default: config } = require('..');
    expect(config).toMatchSnapshot();
  });

  test('initializes staging environment config', () => {
    // @ts-ignore
    process.env = { NODE_ENV: 'staging', IGNORE_ENV_FILES: 'true' };
    const { default: config } = require('..');
    expect(config).toMatchSnapshot();
  });

  test('initializes production environment config', () => {
    process.env = { NODE_ENV: 'production', IGNORE_ENV_FILES: 'true' };
    const { default: config } = require('..');
    expect(config).toMatchSnapshot();
  });
});
