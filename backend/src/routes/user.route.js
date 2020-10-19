const express = require("express");
const router = express.Router();
const {
  protectedController,
  authMiddleware,
  adminMiddleware,
} = require("../controllers/auth.controller");
const { readController } = require("../controllers/user.controller");

router.get("/profile", protectedController, authMiddleware, readController);

module.exports = router;
