const nodemailer = require("nodemailer");
require('dotenv').config();

// async..await is not allowed in global scope, must use a wrapper
async function main(accessToken, refreshToken, toMail, mailTitle, mailContent){

  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  // let testAccount = await nodemailer.createTestAccount();

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      type: "OAuth2",
      user: process.env.MAIL,
      clientId: process.env.MAIL_ID,
      clientSecret: process.env.MAIL_SECRET,
      refreshToken: refreshToken,
      accessToken: accessToken
    }
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"🐬 🐬 🐬 Elk Tree Studio Notification "<service@elk-tree.studio>', // sender address
    to: toMail, // list of receivers
    subject: mailTitle, // Subject line
    text: mailTitle, // plain text body
    html: mailContent // html body
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}

module.exports = main;

// main().catch(console.error);
