const Tag = require("../models/tag.model");
const Blog = require("../models/blog.model");
const slugify = require("slugify");
const { errorHandler } = require("../helpers/dbHandlingError");

exports.createTagController = (req, res) => {
  const { name } = req.body;
  let slug = slugify(name).toLowerCase();
  let tag = new Tag({ name, slug });
  tag.save((err, data) => {
    if (err) {
      return res.status(500).json({ error: errorHandler(err) });
    }
    res.json(data);
  });
};

exports.listTagController = (req, res) => {
  Tag.find({}).exec((err, data) => {
    if (err) {
      return res.status(500).json({ error: errorHandler(err) });
    }
    res.json(data);
  });
};

exports.readTagController = (req, res) => {
  const slug = req.params.slug.toLowerCase();
  Tag.findOne({ slug }).exec((err, tag) => {
    if (err) {
      return res.status(500).json({ error: errorHandler(err) });
    }
    // res.json(tag);
    Blog.find({ tags: tag })
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
          res.json({ tag: tag, blogs: data });
        }
      });
  });
};

exports.removeTagController = (req, res) => {
  const slug = req.params.slug.toLowerCase();
  Tag.findOneAndRemove({ slug }).exec((err, data) => {
    if (err) {
      return res.status(500).json({ error: errorHandler(err) });
    } else if (data === null) {
      res.status(404).json({ error: "We were unable to find that tag." });
    } else {
      res.status(200).json({ message: "Tag deleted successfully!" });
    }
  });
};
