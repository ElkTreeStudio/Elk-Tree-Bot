const nodemailer = require("nodemailer");

// async..await is not allowed in global scope, must use a wrapper
async function main(accessToken, refreshToken, toMail){

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
      user: "notice@elk-tree.studio",
      clientId: "578082596227-5rr7jne208i2kq5meib67thsakr8me9p.apps.googleusercontent.com",
      clientSecret: "PBMF3J_ctLI2FwuTJ6LMKktV",
      refreshToken: refreshToken,
      accessToken: accessToken
    }
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"👹 Elk Tree Studio Notification "<service@elk-tree.studio>', // sender address
    to: toMail, // list of receivers
    subject: "Updated Notification", // Subject line
    text: "Updated Notification", // plain text body
    html: `
      <h1>
        Your Dashboard was updated!
      </h1>
      <p>
        Please see new version in <a href="https://fable-smartboss.elk-tree.site/">https://fable-smartboss.elk-tree.site/</a>.
      </p>
      <p>
        Best regards,<br />
        Elk Tree Studio Team.
      </p>

    ` // html body
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}

module.exports = main;

// main().catch(console.error);
