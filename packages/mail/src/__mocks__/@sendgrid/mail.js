const send = jest.fn().mockResolvedValue([{ body: {} }]);
const setApiKey = jest.fn();

function MailService() {
  return { send, setApiKey };
}

module.exports = {
  MailService,
  send,
  setApiKey,
};
