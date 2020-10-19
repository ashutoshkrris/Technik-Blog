const express = require("express");
const router = express.Router();

// controllers
const {
  protectedController,
  adminMiddleware,
} = require("../controllers/auth.controller");
const {
  createTagController,
  listTagController,
  readTagController,
  removeTagController,
} = require("../controllers/tag.controller");

// validators
const { runValidation } = require("../validators/index");
const { tagValidator } = require("../validators/tag.valid");

// routers
router.post(
  "/tag",
  tagValidator,
  runValidation,
  protectedController,
  adminMiddleware,
  createTagController
);
router.get("/tags", listTagController);
router.get("/tag/:slug", readTagController);
router.delete(
  "/tag/:slug",
  protectedController,
  adminMiddleware,
  removeTagController
);

module.exports = router;
