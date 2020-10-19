const Category = require("../models/category.model");
const Blog = require("../models/blog.model");
const slugify = require("slugify");
const { errorHandler } = require("../helpers/dbHandlingError");

exports.createCategoryController = (req, res) => {
  const { name } = req.body;
  let slug = slugify(name).toLowerCase();
  let category = new Category({ name, slug });
  category.save((err, data) => {
    if (err) {
      return res.status(500).json({ error: errorHandler(err) });
    }
    res.json(data);
  });
};

exports.listCategoryController = (req, res) => {
  Category.find({}).exec((err, data) => {
    if (err) {
      return res.status(500).json({ error: errorHandler(err) });
    }
    res.json(data);
  });
};

exports.readCategoryController = (req, res) => {
  const slug = req.params.slug.toLowerCase();
  Category.findOne({ slug }).exec((err, category) => {
    if (err) {
      return res.status(500).json({ error: errorHandler(err) });
    }
    // res.json(category);
    Blog.find({ categories: category })
      .populate("categories", "_id name slug")
      .populate("tags", "_id name slug")
      .populate("postedBy", "_id name")
      .select(
        "_id title slug excerpt categories postedBy tags createdAt updatedAt"
      )
      .exec((err, data) => {
        if (err) {
          return res.status(500).json({ error: errorHandler(err) });
        } else {
          res.json({ category: category, blogs: data });
        }
      });
  });
};

exports.removeCategoryController = (req, res) => {
  const slug = req.params.slug.toLowerCase();
  Category.findOneAndRemove({ slug }).exec((err, data) => {
    if (err) {
      return res.status(500).json({ error: errorHandler(err) });
    } else if (data === null) {
      res.status(404).json({ error: "We were unable to find that category." });
    } else {
      res.json({ message: "Category deleted successfully!" });
    }
  });
};
