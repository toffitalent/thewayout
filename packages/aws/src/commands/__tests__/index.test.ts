import { bootstrap } from '../bootstrap';
import { secrets } from '../secrets';

jest.mock('../bootstrap', () => ({ bootstrap: jest.fn(), defaults: { repositories: ['test'] } }));
jest.mock('../secrets', () => ({ secrets: jest.fn() }));

describe('commands', () => {
  let argv: any;

  beforeEach(() => {
    argv = process.argv;
  });

  afterEach(() => {
    process.argv = argv;
  });

  (
    [
      ['bootstrap', bootstrap],
      ['secrets', secrets],
    ] as [string, () => void][]
  ).forEach(([command, handler]) => {
    test(`handles ${command} command`, () => {
      jest.isolateModules(() => {
        process.argv = ['_', '_', command];
        // eslint-disable-next-line global-require
        require('..');
      });
      expect(handler).toBeCalledTimes(1);
    });
  });
});
