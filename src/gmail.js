const fs = require('fs');
const readline = require('readline');
const { google } = require('googleapis');
const main = require('./mail');
require('dotenv').config();

// If modifying these scopes, delete token.json.
const SCOPES = ['https://mail.google.com/'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = 'token.json';

const credentials = {
  client_id: process.env.MAIL_ID,
  client_secret: process.env.MAIL_SECRET,
  redirect_uri: 'https://developers.google.com/oauthplayground'
};

const token = {
  access_token: process.env.GMAIL_TOKEN,
  refresh_token: process.env.GMAIL_REFRESH_TOKEN,
  scope: process.env.GMAIL_SCOPE,
  token_type: process.env.GMAIL_TOKEN_TYPE,
  expiry_date: process.env.GMAIL_EXPIRY_DATE,
};

// Load client secrets from a local file.
/* fs.readFile('credentials.json', (err, content) => {
  if (err) return console.log('Error loading client secret file:', err);
  // Authorize a client with credentials, then call the Gmail API.
  authorize(JSON.parse(content), listLabels);
}); */

let mailTo = [];
let mailTitle = '';
let mailContent = '';

function sendMail(mailToPeople, mailTitleReq, mailContentReq) {
  mailTo = mailToPeople;
  mailTitle = mailTitleReq;
  mailContent = mailContentReq;
  authorize(listLabels);
}

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(callback) {
  const { client_secret, client_id, redirect_uri } = credentials;
  const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uri);
  // Check if we have previously stored a token.
  oAuth2Client.setCredentials(token);
  callback(oAuth2Client);
  /* 
  fs.readFile(TOKEN_PATH, (err, token) => {
    console.log(JSON.parse(token));
    if (err) return getNewToken(oAuth2Client, callback);
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client);
  });
  */
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getNewToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
    prompt : 'consent'
  });
  console.log('Authorize this app by visiting this url:', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('Enter the code from that page here: ', (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error('Error retrieving access token', err);
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) return console.error(err);
        console.log('Token stored to', TOKEN_PATH);
      });
      callback(oAuth2Client);
    });
  });
}

/**
 * Lists the labels in the user's account.
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
function listLabels(auth) {
  const gmail = google.gmail({version: 'v1', auth});
  gmail.users.labels.list({
    userId: 'me',
  }, (err, res) => {
    if (err) return console.log('The API returned an error: ' + err);
    const labels = res.data.labels;
    if (labels.length) {
      console.log('Labels:');
      labels.forEach((label) => {
        console.log(`- ${label.name}`);
      });
      main(auth.credentials.access_token, auth.credentials.refresh_token, mailTo, mailTitle, mailContent).catch(console.error);
    } else {
      console.log('No labels found.');
    }
  });
}

module.exports = sendMail;
