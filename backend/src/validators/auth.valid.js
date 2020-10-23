const { check } = require("express-validator");

exports.signupValidator = [
  check("name").not().isEmpty().withMessage("Name cannot be blank."),
  check("email", "Email cannot be blank")
    .isEmail()
    .withMessage("Email is not valid."),
  check("password")
    .trim()
    .matches(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%&_])(?=\S+$).{8,20}$/)
    .withMessage(
      "The password must be 8 to 20 characters long and must contain atleast one lower case, one uppercase, one special character(@,#,$,%,&,_) and one digit."
    ),
  check("confirmPassword", "Confirm Password cannot be empty.")
    .trim()
    .custom(async function (confirmPassword, { req }) {
      const password = req.body.password;
      if (password !== confirmPassword) {
        throw new Error("Password and Confirm Password do not match.");
      }
    }),
];

exports.loginValidator = [
  check("email", "Email cannot be blank")
    .isEmail()
    .withMessage("Email is not valid."),
  check("password")
    .trim()
    .matches(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%&_])(?=\S+$).{8,20}$/)
    .withMessage(
      "The password must have been 8 to 20 characters long and must had atleast one lower case, one uppercase, one special character(@,#,$,%,&,_) and one digit."
    ),
];

exports.forgotPasswordValidator = [
  check("email")
    .not()
    .isEmpty()
    .withMessage("Email cannot be blank.")
    .isEmail()
    .withMessage("Email is not valid."),
];

exports.resetPasswordValidator = [
  check("newPassword")
    .trim()
    .matches(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%&_])(?=\S+$).{8,20}$/)
    .withMessage(
      "The password must be 8 to 20 characters long and must have atleast one lower case, one uppercase, one special character(@,#,$,%,&,_) and one digit."
    ),
  check("confirmPassword", "Confirm Password cannot be empty.")
    .trim()
    .custom(async function (confirmPassword, { req }) {
      const password = req.body.newPassword;
      if (password !== confirmPassword) {
        throw new Error("Password and Confirm Password do not match.");
      }
    }),
];
