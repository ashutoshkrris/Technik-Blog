const nodemailer = require("nodemailer");
const { errorHandler } = require("../helpers/dbHandlingError");

//Configuring nodemailer
let mailTransporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_FROM,
    pass: process.env.EMAIL_PASSWORD,
  },
});

exports.contactController = (req, res) => {
  const { name, email, subject, message } = req.body;

  const emailData = {
    to: process.env.EMAIL_FROM,
    from: `${process.env.APPNAME} <noreply@technik.com>`,
    subject: `New Contact Form Submission | ${process.env.APPNAME}`,
    text: `${name} just filled up the contact form:\n Name: ${name}\nEmail: ${email}\nSubject: ${subject}\nMessage: ${message}`,
    html: `
      <h4>${name} just filled up the contact form:</h4>
      <p>Name : ${name}</p>
      <p>Email : ${email}</p>
      <p>Subject : ${subject}</p>
      <p>Message : ${message}</p>
    `,
  };
  mailTransporter.sendMail(emailData, (err, data) => {
    if (err) {
      return res.status(451).json({
        error: errorHandler(err),
      });
    } else {
      return res.status(250).json({
        success: true,
      });
    }
  });
};

exports.contactAuthorController = (req, res) => {
  const { name, authorEmail, email, subject, message } = req.body;

  let mailList = [authorEmail, process.env.EMAIL_FROM];

  const emailData = {
    to: mailList,
    from: `${process.env.APPNAME} <noreply@technik.com>`,
    subject: `Someone messaged you on ${process.env.APPNAME}`,
    text: `${name} just messaged you:\n Name: ${name}\nEmail: ${email}\nSubject: ${subject}\nMessage: ${message}`,
    html: `
      <h4>Message Details :</h4>
      <p>Name : ${name}</p>
      <p>Email : ${email}</p>
      <p>Subject : ${subject}</p>
      <p>Message : ${message}</p>
    `,
  };
  mailTransporter.sendMail(emailData, (err, data) => {
    if (err) {
      return res.status(451).json({
        error: errorHandler(err),
      });
    } else {
      return res.status(250).json({
        success: true,
      });
    }
  });
};
