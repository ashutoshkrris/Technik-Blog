const express = require("express");
const router = express.Router();
const {
  createBlogController,
  listBlogController,
  listBlogCTController,
  getBlogController,
  removeBlogController,
  updateBlogController,
  photoController,
  relatedBlogController,
  listSearchController,
} = require("../controllers/blog.controller");
const {
  protectedController,
  adminMiddleware,
} = require("../controllers/auth.controller");

// validations here

// routes here
router.post(
  "/create",
  protectedController,
  adminMiddleware,
  createBlogController
);
router.get("/posts", listBlogController);
router.post("/posts/ct", listBlogCTController);
router.get("/post/:slug", getBlogController);
router.delete(
  "/post/:slug",
  protectedController,
  adminMiddleware,
  removeBlogController
);
router.put(
  "/post/:slug",
  protectedController,
  adminMiddleware,
  updateBlogController
);
router.get("/photo/:slug", photoController);
router.post("/related", relatedBlogController);
router.get("/search", listSearchController);

module.exports = router;
