module.exports = jest.fn().mockImplementation((...args) => ({
  args,
  alias: jest.fn((_, cb) => cb()),
  flush: jest.fn((_, cb) => cb()),
  identify: jest.fn((_, cb) => cb()),
  track: jest.fn((_, cb) => cb()),
}));
