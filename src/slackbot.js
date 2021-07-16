const { WebClient } = require('@slack/web-api');
require('dotenv').config();

async function sendMessageFromBot(channel='bot_notification', message) {
  // Read a token from the environment variables
  const token = process.env.SLACK_ACCESS_TOKEN;

  // Initialize
  const web = new WebClient(token);

  // Given some known conversation ID (representing a public channel, private channel, DM or group DM)
  const conversationId = channel;

  async function postMessage() {
    const result = await web.chat.postMessage({
      text: message,
      channel: conversationId,
    });

    // The result contains an identifier for the message, `ts`.
    console.log(`Successfully send message ${result.ts} in conversation ${conversationId}`);
    return 'ok';
  } 
  const res = await postMessage();
  return res;
}

module.exports = sendMessageFromBot;
