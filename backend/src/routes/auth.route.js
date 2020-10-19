const express = require("express");
const router = express.Router();
const {
  signupController,
  loginController,
  logoutController,
} = require("../controllers/auth.controller");

// validators
const { runValidation } = require("../validators/index");
const { signupValidator, loginValidator } = require("../validators/auth.valid");

// routes here
router.post("/signup", signupValidator, runValidation, signupController);
router.post("/login", loginValidator, runValidation, loginController);
router.get("/logout", logoutController);

module.exports = router;
