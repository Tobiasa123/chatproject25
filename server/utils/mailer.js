const { Resend } = require("resend");
require("dotenv").config();

const resend = new Resend(process.env.RESEND_API_KEY);

//mailer when creating account
const sendEmail = async (to, subject, text) => {
  try {
    await resend.emails.send({
      from: "no-reply@resend.dev",
      to,
      subject,
      text,
    });
    console.log(`Email sent to ${to}`);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

module.exports = sendEmail;
