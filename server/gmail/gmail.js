const { google } = require('googleapis');
const MailComposer = require('nodemailer/lib/mail-composer');
// const credentials = require('./credentials.json');
// const tokens = require('./tokens.json');

const getGmailService = () => {
  // const { client_secret, client_id, redirect_uris } = credentials.installed;
  const tokens = {
    "access_token": process.env.GMAIL_ACCESS_TOKEN,
    "refresh_token": process.env.GMAIL_REFRESH_TOKEN,
    "scope": "https://www.googleapis.com/auth/gmail.send",
    "token_type": "Bearer",
    "expiry_date": 1684190581772
  }

  const gmail_client_id = process.env.GMAIL_CLIENT_ID;
  const gmail_client_secret = process.env.GMAIL_CLIENT_SECRET;
  const oAuth2Client = new google.auth.OAuth2(gmail_client_id, gmail_client_secret, "http://localhost");
  oAuth2Client.setCredentials(tokens);
  const gmail = google.gmail({ version: 'v1', auth: oAuth2Client });
  return gmail;
};

const encodeMessage = (message) => {
  return Buffer.from(message).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
};

const createMail = async (options) => {
  const mailComposer = new MailComposer(options);
  const message = await mailComposer.compile().build();
  return encodeMessage(message);
};

const sendMail = async (options) => {
  const gmail = getGmailService();
  const rawMessage = await createMail(options);
  const { data: { id } = {} } = await gmail.users.messages.send({
    userId: 'me',
    resource: {
      raw: rawMessage,
    },
  });
  return id;
};

module.exports = sendMail;