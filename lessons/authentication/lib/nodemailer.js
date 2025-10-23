import nodemailer from "nodemailer";

const testAccount = await nodemailer.createTestAccount();

// Create a test account or replace with real credentials.
const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: testAccount.user,
    pass: testAccount.pass,
  },
});

export const sendEmail = async ({to, subject, html}) => {
    const info = await transporter.sendMail({
        from: `'URL_SHORTERNER' < ${testAccount.user} >`,
        to,
        subject,
        html
    });

    const testEmailUrl = nodemailer.getTestMessageUrl(info);
    console.log("Verify Email: ", testEmailUrl);
}