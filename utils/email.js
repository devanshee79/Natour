const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    // creating transporter
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: 2525 || EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD,
        }
    });

    // defining the email options
    const mailOptions = {
        from: 'DR <devansheerana02@gmail.com>',
        to: options.email,
        subject: options.subject,
        text: options.message
    };

    // sending the email
    await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;