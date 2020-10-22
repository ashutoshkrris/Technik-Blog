const express = require("express");
const router = express.Router();

// Controllers
const {
  protectedController,
  authMiddleware,
  adminMiddleware,
} = require("../controllers/auth.controller");
const {
  readController,
  publicProfileController,
  profileUpdateController,
  profilePhotoController,
} = require("../controllers/user.controller");

// Routers
router.get("/profile", protectedController, authMiddleware, readController);
router.get("/:username", publicProfileController);
router.put(
  "/update",
  protectedController,
  authMiddleware,
  profileUpdateController
);
router.get("/photo/:username", profilePhotoController);

module.exports = router;
