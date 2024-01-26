// eslint-disable-next-line import/no-extraneous-dependencies
const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  /*
        create transporter
        define the email options
        send the email with nodemailer
    */

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: "Ahmed Zakaria <ahmedzakria103@gamil.com>",
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
