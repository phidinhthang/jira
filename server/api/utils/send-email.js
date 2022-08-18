const nodemailer = require("nodemailer");

let testAccount;
let transporter;
(async () => {
  testAccount = await nodemailer.createTestAccount();
  console.log("test account ", testAccount);
  transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });
})();

module.exports = async function sendEmail(to, subject, html) {
  let info = await transporter.sendMail({
    from: '"Jira" <jira@example.com>',
    to,
    subject,
    html,
  });
  console.log("Message sent: %s", info.messageId);
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
};
