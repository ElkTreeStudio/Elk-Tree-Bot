const bodyParser = require('body-parser');
const express = require('express');
const { bottender } = require('bottender');

const sendMessageFromBot = require('./slackbot.js');

const sendMail = require('./gmail.js');

const app = bottender({
  dev: process.env.NODE_ENV !== 'production',
});

const port = Number(process.env.PORT) || 5000;

// the request handler of the bottender app
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  const verify = (req, _, buf) => {
    req.rawBody = buf.toString();
  };
  server.use(bodyParser.json({ verify }));
  server.use(bodyParser.urlencoded({ extended: false, verify }));

  // your custom route
  server.get('/api', (req, res) => {
    res.json({ ok: true });
  });

  // your custom route
  server.post('/api/mail', (req, res) => {
    const { mailTo } = req.body;
    sendMail(mailTo);
    res.status(200).json({
      status: 200,
      message: 'successful',
      data: true
    });
  });

  // your custom route
  server.post('/api/notify', async (req, res) => {
    const { channel, message } = req.body;
    const channelId = channel ? channel : 'testing_space';
    const data = await sendMessageFromBot(channelId, message);
    if (data === 'ok') {
      res.status(200).json({
        status: 200,
        message: 'successful',
        data: true
      });
    } else {
      res.status(400).json({
        status: 400,
        message: 'error',
        data: null
      });
    }
  });

  server.get('/test', (req, res) => {
    res.json({ ok: true });
  });

  // route for webhook request
  server.all('*', (req, res) => {
    return handle(req, res);
  });

  server.listen(port, err => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
});
