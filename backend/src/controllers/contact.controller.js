const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

exports.contactController = (req, res) => {
  const { name, email, subject, message } = req.body;

  const emailData = {
    to: process.env.EMAIL_TO,
    from: process.env.EMAIL_TO,
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
  sgMail
    .send(emailData)
    .then((sent) => {
      return res.json({
        success: true,
      });
    })
    .catch((error) => {
      console.error(error);
    });
};

exports.contactAuthorController = (req, res) => {
  const { name, authorEmail, email, subject, message } = req.body;

  let mailList = [authorEmail, process.env.EMAIL_TO];

  const emailData = {
    to: mailList,
    from: process.env.EMAIL_TO,
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
  sgMail
    .send(emailData)
    .then((sent) => {
      return res.json({
        success: true,
      });
    })
    .catch((error) => {
      console.error(error);
    });
};
