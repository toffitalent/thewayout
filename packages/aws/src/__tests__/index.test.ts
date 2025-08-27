describe('Application', () => {
  let processEnv: any;

  beforeEach(() => {
    processEnv = process.env;
  });

  afterEach(() => {
    process.env = processEnv;
  });

  test('creates AWS resources', () => {
    let res: any;

    jest.isolateModules(() => {
      process.env = {
        API_URL: 'https://api.example.com',
        MAIL_URL: 'https://mail.example.com',
        WEB_URL: 'https://www.example.com',
      };

      jest.mock('aws-cdk-lib', () => {
        const core = jest.requireActual('aws-cdk-lib');
        return {
          ...core,
          App: jest.fn().mockImplementation(() => {
            core.App.prototype.actualSynth = core.App.prototype.synth;
            core.App.prototype.synth = function synth() {
              // eslint-disable-next-line
              console.log(this.actualSynth());
            };
            return new core.App({ context: { env: 'production' } });
          }),
        };
      });

      const spy = jest.spyOn(console, 'log').mockImplementation();
      // eslint-disable-next-line
      require('..');

      [[res]] = spy.mock.calls;
      spy.mockRestore();
    });

    const stacks = Object.keys(res.manifest.artifacts);

    [
      'Production-ApiStack',
      'Production-MailStack',
      'Production-UploadsStack',
      'Production-VpcStack',
      'Production-WebStack',
    ].forEach((stack) => {
      expect(stacks.includes(stack)).toBe(true);
    });
  });
});
