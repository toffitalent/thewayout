const actual = jest.requireActual('@disruptive-labs/ui');

const showToast = jest.fn();

actual.Toast.show = showToast;
actual.Toast.danger = showToast;
actual.Toast.info = showToast;
actual.Toast.success = showToast;
actual.Toast.warning = showToast;

module.exports = {
  ...actual,
  showToast,
};
