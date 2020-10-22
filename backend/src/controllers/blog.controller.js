const Blog = require("../models/blog.model");
const Category = require("../models/category.model");
const Tag = require("../models/tag.model");
const formidable = require("formidable");
const slugify = require("slugify");
const stripHtml = require("string-strip-html");
const _ = require("lodash");
const { errorHandler } = require("../helpers/dbHandlingError");
const fs = require("fs");
const { smartTrim } = require("../helpers/excerpts.blog");

// Create Blog
exports.createBlogController = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(400).json({ error: "Image could not be uploaded." });
    }
    const { title, body, categories, tags } = fields;

    // Custom Validations
    if (!title || !title.length) {
      return res.status(400).json({ error: "Title is required." });
    }

    if (!body || body.length < 200) {
      return res.status(400).json({ error: "Content is too short." });
    }

    if (!categories || categories.length === 0) {
      return res
        .status(400)
        .json({ error: "At least one category is required." });
    }

    if (!tags || tags.length === 0) {
      return res.status(400).json({ error: "At least one tag is required." });
    }

    // Blog
    let blog = new Blog();
    blog.title = title;
    blog.body = body;
    blog.excerpt = smartTrim(body, 320, " ", " ...");
    blog.slug = slugify(title).toLowerCase();
    blog.meta_title = `${title} | ${process.env.APPNAME}`;
    blog.meta_desc = stripHtml(body.substring(0, 160)).result;
    blog.postedBy = req.user._id;

    // Categories and Tags Arrays
    let arrayCategories = categories && categories.split(",");
    let arrayTags = tags && tags.split(",");

    // Handling photo(if any)
    if (files.photo) {
      if (files.photo.size > 1000000) {
        return res
          .status(400)
          .json({ error: "Image size cannot exceed size of 1 MB." });
      }
      blog.photo.data = fs.readFileSync(files.photo.path);
      blog.photo.contentType = files.photo.type;
    }

    blog.save((err, result) => {
      if (err) {
        console.log("Error ", err);
        return res.status(500).json({ error: errorHandler(err) });
      }
      // res.json(result);

      // Find Blog and Update the categories and tags
      Blog.findByIdAndUpdate(
        result._id,
        { $push: { categories: arrayCategories } },
        { new: true }
      ).exec((err, result) => {
        if (err) {
          res.status(500).json({ error: errorHandler(err) });
        } else {
          Blog.findByIdAndUpdate(
            result._id,
            { $push: { tags: arrayTags } },
            { new: true }
          ).exec((err, result) => {
            if (err) {
              res.status(500).json({ error: errorHandler(err) });
            } else {
              return res.json(result);
            }
          });
        }
      });
    });
  });
};

exports.listBlogController = (req, res) => {
  Blog.find({})
    .populate("categories", "_id name slug")
    .populate("tags", "_id name slug")
    .populate("postedBy", "_id name username")
    .select(
      "_id title slug excerpt categories tags postedBy createdAt updatedAt"
    )
    .exec((err, data) => {
      if (err) {
        return res.status(400).json({ error: errorHandler(err) });
      }
      res.json(data);
    });
};

exports.listBlogCTController = (req, res) => {
  let limit = req.body.limit ? parseInt(req.body.limit) : 5;
  let skip = req.body.skip ? parseInt(req.body.skip) : 0;

  let blogs;
  let categories;
  let tags;

  Blog.find({})
    .populate("categories", "_id name slug")
    .populate("tags", "_id name slug")
    .populate("postedBy", "_id name username profile")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .select(
      "_id title slug excerpt categories tags postedBy createdAt updatedAt"
    )
    .exec((err, data) => {
      if (err) {
        return res.status(400).json({ error: errorHandler(err) });
      }
      blogs = data;
      // get all categories
      Category.find({}).exec((err, c) => {
        if (err) {
          return res.json({
            error: errorHandler(err),
          });
        }
        categories = c; // categories
        // get all tags
        Tag.find({}).exec((err, t) => {
          if (err) {
            return res.json({
              error: errorHandler(err),
            });
          }
          tags = t;
          // return all blogs categories tags
          res.json({ blogs, categories, tags, size: blogs.length });
        });
      });
    });
};

exports.getBlogController = (req, res) => {
  const slug = req.params.slug.toLowerCase();
  Blog.findOne({ slug })
    .populate("categories", "_id name slug")
    .populate("tags", "_id name slug")
    .populate("postedBy", "_id name username")
    .select(
      "_id title body slug excerpt meta_title meta_desc categories tags postedBy createdAt updatedAt"
    )
    .exec((err, data) => {
      if (err) {
        return res.json({
          error: errorHandler(err),
        });
      }
      res.json(data);
    });
};

exports.removeBlogController = (req, res) => {
  const slug = req.params.slug.toLowerCase();
  Blog.findOneAndRemove({ slug }).exec((err, data) => {
    if (err) {
      return res.status(500).json({ error: errorHandler(err) });
    } else if (data === null) {
      res.status(404).json({ error: "We were unable to find that post." });
    } else {
      res.status(200).json({ message: "Blog post deleted successfully." });
    }
  });
};

exports.updateBlogController = (req, res) => {
  const slug = req.params.slug.toLowerCase();

  Blog.findOne({ slug }).exec((err, old) => {
    if (err) {
      return res.status(500).json({ error: errorHandler(err) });
    }

    let form = new formidable.IncomingForm();
    form.keepExtensions = true;

    form.parse(req, (err, fields, files) => {
      if (err) {
        return res.status(400).json({ error: "Image could not be uploaded." });
      }

      if (!old) {
        res.status(404).json({ error: "We were unable to find that post." });
      } else {
        let oldSlug = old.slug;
        old = _.merge(old, fields);
        old.slug = oldSlug;

        const { body, meta_desc, categories, tags } = fields;

        if (body) {
          old.excerpt = smartTrim(body, 320, " ", " ...");
          old.meta_desc = stripHtml(body.substring(0, 160)).result;
        }

        if (categories) {
          old.categories = categories.split(",");
        }

        if (tags) {
          old.tags = tags.split(",");
        }

        // Handling photo(if any)
        if (files.photo) {
          if (files.photo.size > 1000000) {
            return res
              .status(400)
              .json({ error: "Image size cannot exceed size of 1 MB." });
          }
          old.photo.data = fs.readFileSync(files.photo.path);
          old.photo.contentType = files.photo.type;
        }

        old.save((err, result) => {
          if (err) {
            console.log("Error ", err);
            return res.status(500).json({ error: errorHandler(err) });
          }
          res.json(result);
        });
      }
    });
  });
};

exports.photoController = (req, res) => {
  const slug = req.params.slug.toLowerCase();
  Blog.findOne({ slug })
    .select("photo")
    .exec((err, blog) => {
      if (err) {
        return res.status(500).json({ error: errorHandler(err) });
      } else if (blog === null) {
        res.status(404).json({ error: "We were unable to find that photo." });
      } else {
        res.set("Content-Type", blog.photo.contentType);
        return res.send(blog.photo.data);
      }
    });
};

exports.relatedBlogController = (req, res) => {
  let limit = req.body.limit ? req.body.limit : 3;
  const { _id, categories } = req.body.blog;

  Blog.find({ _id: { $ne: _id }, categories: { $in: categories } })
    .limit(limit)
    .populate("postedBy", "_id name username profile")
    .select("title slug excerpt postedBy createdAt updatedAt")
    .exec((err, blogs) => {
      if (err) {
        return res.status(404).json({
          error: "Blogs not found",
        });
      }
      res.json(blogs);
    });
};

// Search for blog
exports.listSearchController = (req, res) => {
  const { search } = req.query;
  if (search) {
    Blog.find(
      {
        $or: [
          { title: { $regex: search, $options: "i" } },
          { body: { $regex: search, $options: "i" } },
        ],
      },
      (err, blog) => {
        if (err) {
          return res.status(400).json({ error: errorHandler(err) });
        } else {
          return res.json(blog);
        }
      }
    ).select("-photo -body");
  }
};
