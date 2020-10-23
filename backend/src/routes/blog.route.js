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
  listUserBlogController,
} = require("../controllers/blog.controller");
const {
  protectedController,
  adminMiddleware,
  authMiddleware,
  canUpdateandDeleteMiddleware,
} = require("../controllers/auth.controller");

// validations here

// routes for admin here
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

// routes for auth users
router.post(
  "/user/create",
  protectedController,
  authMiddleware,
  createBlogController
);
router.delete(
  "/user/post/:slug",
  protectedController,
  authMiddleware,
  canUpdateandDeleteMiddleware,
  removeBlogController
);
router.put(
  "/user/post/:slug",
  protectedController,
  authMiddleware,
  canUpdateandDeleteMiddleware,
  updateBlogController
);
router.get("/:username/posts", listUserBlogController);

module.exports = router;
