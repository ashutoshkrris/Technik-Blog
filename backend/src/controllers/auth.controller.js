const User = require("../models/users.model");
const Blog = require("../models/blog.model");
const shortId = require("shortid");
const jwt = require("jsonwebtoken");
const expressJwt = require("express-jwt");
const { errorHandler } = require("../helpers/dbHandlingError");
const nodemailer = require("nodemailer");
const _ = require("lodash");

//Configuring nodemailer
let mailTransporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_FROM,
    pass: process.env.EMAIL_PASSWORD,
  },
});

exports.signupController = (req, res) => {
  const { name, email, password, confirmPassword } = req.body;
  // check if user is already registered
  User.findOne({ email: req.body.email }).exec((err, user) => {
    if (user) {
      return res.status(403).json({ error: "User already exists" });
    }
    const token = jwt.sign(
      { name, email, password },
      process.env.JWT_ACCOUNT_ACTIVATION,
      { expiresIn: "30m" }
    );
    const emailData = {
      to: email,
      from: `${process.env.APPNAME} <noreply@technik.com>`,
      subject: `Account Activation Link | ${process.env.APPNAME}`,
      html: `
      <p>Hello ${name},</p>
      <p>Thank you for signing up on <a href="http://technik.com">Technik</a>.</p>
      <p>In order to activate your Technik account, please use the below link to confirm your email address and complete the activation process.<p>
      <p>${process.env.CLIENT_URL}/users/account/activate/${token}</p>
      <br>
      <p>Thanks and regards<br>Technik</p>
      `,
    };
    mailTransporter.sendMail(emailData, (err, data) => {
      if (err) {
        return res.status(451).json({
          error: errorHandler(err),
        });
      } else {
        return res.status(250).json({
          message: `Please follow the instructions mentioned in the email sent to ${email} in order to activate your account.`,
        });
      }
    });
  });
};

exports.activationController = (req, res) => {
  const token = req.body.token;
  if (token) {
    jwt.verify(token, process.env.JWT_ACCOUNT_ACTIVATION, function (
      err,
      decoded
    ) {
      if (err) {
        return res.status(401).json({
          error: "Expired link. Please signup again.",
        });
      }

      const { name, email, password } = jwt.decode(token);

      let username = shortId.generate();
      let profile = `${process.env.CLIENT_URL}/profile/${username}`;

      const user = new User({ name, email, password, profile, username });
      user.save((err, user) => {
        if (err) {
          return res.status(401).json({
            error: errorHandler(err),
          });
        }
        return res.json({
          message: "Singup success! You can now login.",
        });
      });
    });
  } else {
    return res.json({
      message: "Something went wrong. Try again later.",
    });
  }
};

exports.loginController = (req, res) => {
  const { email, password } = req.body;

  // check if user exist
  User.findOne({ email }).exec((err, user) => {
    if (err || !user) {
      return res.status(404).json({ error: "User doesn't exist." });
    }
    // authenticate
    if (!user.authenticate(password)) {
      return res
        .status(401)
        .json({ error: "Email and Password do not match." });
    }
    // generate a token and send to client
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.cookie("token", token, { expiresIn: "7d" });
    const { _id, username, name, email, role } = user;
    return res.json({ token, user: { _id, username, name, email, role } });
  });
};

exports.logoutController = (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Logged out!" });
};

exports.protectedController = expressJwt({
  secret: process.env.JWT_SECRET,
  algorithms: ["HS256"],
});

exports.authMiddleware = (req, res, next) => {
  const authUserId = req.user._id;
  User.findById({ _id: authUserId }).exec((err, user) => {
    if (err || !user) {
      return res.status(404).json({ error: "User not found!!" });
    }
    req.profile = user;
    next();
  });
};

exports.adminMiddleware = (req, res, next) => {
  const adminUserId = req.user._id;
  console.log(adminUserId);
  User.findById({ _id: adminUserId }).exec((err, user) => {
    if (err || !user) {
      return res.status(404).json({ error: "User not found!!" });
    }
    if (user.role !== 1) {
      return res.status(400).json({ error: "You are not an admin!!" });
    }
    req.profile = user;
    next();
  });
};

exports.canUpdateandDeleteMiddleware = (req, res, next) => {
  const slug = req.params.slug.toLowerCase();
  Blog.findOne({ slug }).exec((err, data) => {
    if (err) {
      return res.status(500).json({ error: errorHandler(err) });
    }
    let authorizedUser =
      data.postedBy._id.toString() === req.profile._id.toString();
    if (!authorizedUser) {
      return res.status(403).json({
        error: "Access to the requested resource is forbidden for some reason.",
      });
    }
    next();
  });
};

exports.forgotPasswordController = (req, res) => {
  const { email } = req.body;
  User.findOne({ email }).exec((err, user) => {
    if (err) {
      return res.status(500).json({ error: errorHandler(err) });
    } else if (user === null) {
      return res.status(404).json({ error: "User doesn't exist." });
    } else {
      const token = jwt.sign(
        { _id: user._id },
        process.env.JWT_RESET_PASSWORD,
        { expiresIn: "15m" }
      );
      const emailData = {
        to: email,
        from: `${process.env.APPNAME} <noreply@technik.com>`,
        subject: `Password Reset Link | ${process.env.APPNAME}`,
        html: `
        <p>Hello ${user.name},</p>
        <p>It happens that we often forget our password. Don't worry, we at <a href="http://technik.com">Technik</a> are here to assist you..</p>
        <p>In order to reset your Technik account password, we need to verify if it's nobody but you trying to reset your password. Please use the below link to confirm your email address and complete the reset password process.<p>
        <p>${process.env.CLIENT_URL}/users/password/reset/${token}</p>
        <br>
        <p>Thanks and regards<br>Technik</p>
        `,
      };
      // update database resetPasswordLink
      return user.updateOne({ resetPasswordLink: token }, (err, success) => {
        if (err) {
          return res.status(500).json({
            error: errorHandler(err),
          });
        } else {
          mailTransporter.sendMail(emailData, (err, data) => {
            if (err) {
              return res.status(451).json({
                error: errorHandler(err),
              });
            } else {
              return res.status(250).json({
                message: `Please follow the instructions mentioned in the email sent to ${email} in order to reset your password.`,
              });
            }
          });
        }
      });
    }
  });
};

exports.resetPasswordController = (req, res) => {
  const { resetPasswordLink, newPassword } = req.body;

  if (resetPasswordLink) {
    jwt.verify(resetPasswordLink, process.env.JWT_RESET_PASSWORD, function (
      err,
      decode
    ) {
      if (err) {
        return res.status(410).json({
          error: "Expired link. Try again",
        });
      }
      User.findOne({ resetPasswordLink }, (err, user) => {
        if (err) {
          return res.status(500).json({
            error: errorHandler(err),
          });
        } else if (user === null) {
          return res.status(404).json({
            error: "User doesn't exist.",
          });
        } else {
          const updatedFields = {
            password: newPassword,
            resetPasswordLink: "",
          };
          user = _.extend(user, updatedFields);
          user.save((err, result) => {
            if (err) {
              return res.status(400).json({
                error: "Error occurred while changing your password",
              });
            }
            res.status(200).json({
              message: `Great! Now you can login with your new password`,
            });
            const emailData = {
              to: user.email,
              from: `${process.env.APPNAME} <noreply@technik.com>`,
              subject: `Password Changed | ${process.env.APPNAME}`,
              html: `
              <p>Hello ${user.name},</p>
              <p>We found that password of your account on <a href="http://technik.com">Technik</a> was changed just now.</p>
              <p>If it was you, you can ignore this email.<p>
              <p>If it wasn't you, kindly report it to us at <a href="${process.env.CLIENT_URL}/contact">here</a> so that we can take further actions.</p>
              <br>
              <p>Thanks and regards<br>Technik</p>
              `,
            };
            mailTransporter.sendMail(emailData, (err, data) => {
              if (err) {
                console.log(errorHandler(err));
              }
            });
          });
        }
      });
    });
  }
};
