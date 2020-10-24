const express = require("express");
const router = express.Router();
const {
  signupController,
  activationController,
  loginController,
  logoutController,
  forgotPasswordController,
  resetPasswordController,
  googleLoginController,
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
router.post("/activate", activationController);
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
router.post("/login/google", googleLoginController);

module.exports = router;
