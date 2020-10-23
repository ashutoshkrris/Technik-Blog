const express = require("express");
const router = express.Router();
const { contactController,contactAuthorController } = require("../controllers/contact.controller");

// validators
const { contactValidator } = require("../validators/contact.valid");
const { runValidation } = require("../validators/index");

// Routes
router.post("/contact", contactValidator, runValidation, contactController);
router.post("/contact/author", contactValidator, runValidation, contactAuthorController);

module.exports = router;
