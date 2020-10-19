const express = require("express");
const router = express.Router();
const {
    createCategoryController,
    listCategoryController,
    readCategoryController,
    removeCategoryController
} = require("../controllers/category.controller");

// validators
const { categoryValidator } = require("../validators/category.valid");
const { runValidation } = require("../validators/index");
const {
  protectedController,
  adminMiddleware,
} = require("../controllers/auth.controller");

// Routes
router.post(
  "/category",
  categoryValidator,
  runValidation,
  protectedController,
  adminMiddleware,
  createCategoryController
);
router.get("/categories", listCategoryController);
router.get("/category/:slug", readCategoryController);
router.delete("/category/:slug", protectedController, adminMiddleware, removeCategoryController);

module.exports = router;
