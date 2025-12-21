import nodemailer from 'nodemailer';
const transporter = nodemailer.createTransport({
    // host: 'smtp.gmail.com',
    // secure: false,
    // service: 'gmail',
    // auth: {
    //   user: process.env.LINKLYS_EMAIL,
    //   pass: process.env.LINKLYS_PASS,
    // },
    host: 'smtp-relay.brevo.com',
    port: 587,
    auth: {
        user: process.env.SMTP_LOGIN,
        pass: process.env.SMTP_PASS,
    }
});
export default transporter;
