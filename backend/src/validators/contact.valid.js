const { check } = require("express-validator");

exports.contactValidator = [
  check("name").not().isEmpty().withMessage("Name cannot be blank."),
  check("email")
    .not()
    .isEmpty()
    .withMessage("Email cannot be blank.")
    .isEmail()
    .withMessage("Email is not valid."),
  check("subject")
    .not()
    .isEmpty()
    .withMessage("Subject cannot be blank.")
    .isLength({ min: 20 })
    .withMessage("Subject is too short."),
  check("message")
    .not()
    .isEmpty()
    .withMessage("Message cannot be blank.")
    .isLength({ min: 20 })
    .withMessage("Message is too short."),
];
