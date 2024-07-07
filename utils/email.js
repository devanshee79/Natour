const nodemailer = require("nodemailer");
const pug = require('pug');
const path = require('path');
const fs = require('fs').promises;
const { convert } = require('html-to-text');
const AppError = require("./appError");

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name.split(" ")[0];
    this.url = url;
    this.from = `Jonas Schmedtmann <${process.env.EMAIL_FROM}>`;
  }

  createTransport() {
    if (process.env.NODE_ENV === "production") {
        console.log("working in prod")
      return nodemailer.createTransport({
        service: process.env.SERVICE_PRODUCTION,
        host: process.env.EMAIL_HOST_PRODUCTION,
        port: process.env.EMAIL_PORT_PRODUCTION,
        secure: false,
        auth: {
          user: process.env.EMAIL_USERNAME_PRODUCTION,
          pass: process.env.EMAIL_PASSWORD_PRODUCTION,
        },
      });
    }

    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  async send(template, subject) {
    // 1) Rendering the template
    
    const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
      firstName: this.firstName,
      url: this.url,
      subject,
    });

   
    // 2) defining the email options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: convert(html),
    };

    // 3) creating a transport and sending the mail
    await this.createTransport().sendMail(mailOptions, (error, info) => {
      if (error) {
        throw new AppError("OOPS !! There is problem somwhere", 500);
      } else {
        console.log("Email sent successfully!");
        console.log("Message ID:", info.messageId);
        console.log("Preview URL:", nodemailer.getTestMessageUrl(info));
      }
    });
  }

  // Sending email for signUp
  async sendWelcome() {
    await this.send("welcome", "Welcome to the Natours Family!");
  }

  // Sending mail for password reset
  async sendPasswordReset() {
    await this.send(
      "passwordReset",
      "Your password reset token (valid for only 10 minutes)",
    );
  }
};
