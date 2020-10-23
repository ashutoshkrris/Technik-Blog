const express = require("express");
const router = express.Router();
const {
  signupController,
  loginController,
  logoutController,
  forgotPasswordController,
  resetPasswordController,
} = require("../controllers/auth.controller");

// validators
const { runValidation } = require("../validators/index");
const {
  signupValidator,
  loginValidator,
  forgotPasswordValidator,
  resetPasswordValidator,
} = require("../validators/auth.valid");

// routes here
router.post("/signup", signupValidator, runValidation, signupController);
router.post("/login", loginValidator, runValidation, loginController);
router.get("/logout", logoutController);
router.put(
  "/password/forgot",
  forgotPasswordValidator,
  runValidation,
  forgotPasswordController
);
router.put(
  "/password/reset",
  resetPasswordValidator,
  runValidation,
  resetPasswordController
);

module.exports = router;
