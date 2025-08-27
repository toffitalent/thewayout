const on = jest.fn();
const start = jest.fn();
const stop = jest.fn();

module.exports = {
  Consumer: jest.fn(() => ({
    on,
    start,
    stop,
  })),
  on,
  start,
  stop,
};
