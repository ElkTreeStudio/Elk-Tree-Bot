const { sendMessageFromBot } = require('./slack.js');

module.exports = async(req, res) => {

  const {
    channel,
    message
  } = req.body;

  const result = await sendMessageFromBot(channel, message);
  
  res.send({
    query: req.query,
    params: req.params,
    body: req.body,
    project: process.env.PROJECT_NAME,
    result: result
  });
};
