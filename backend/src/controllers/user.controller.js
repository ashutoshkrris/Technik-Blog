const User = require("../models/users.model");
const Blog = require("../models/blog.model");
const { errorHandler } = require("../helpers/dbHandlingError");
const _ = require("lodash");
const formidable = require("formidable");
const fs = require("fs");

exports.readController = (req, res) => {
  req.profile.hashed_password = undefined;
  return res.json(req.profile);
};

exports.publicProfileController = (req, res) => {
  let username = req.params.username;
  let user;
  let blogs;

  User.findOne({ username }).exec((err, userFromDB) => {
    if (err) {
      return res.status(500).json({ error: errorHandler(err) });
    } else if (!userFromDB) {
      return res.status(404).json({ error: "User doesn't exist." });
    } else {
      user = userFromDB;
      let userID = user._id;
      Blog.find({ postedBy: userID })
        .populate("categories", "_id name slug")
        .populate("tags", "_id name slug")
        .populate("postedBy", "_id name")
        .limit(10)
        .select(
          "_id title slug excerpt categories tags postedBy createdAt updatedAt"
        )
        .exec((err, data) => {
          if (err) {
            return res.status(500).json({ error: errorHandler(err) });
          } else {
            user.photo = undefined;
            user.hashed_password = undefined;
            return res.json({ user, blogs: data });
          }
        });
    }
  });
};

exports.profileUpdateController = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(500).json({ error: "Photo could not be uploaded." });
    }
    let user = req.profile;
    user = _.extend(user, fields);

    if (fields.password) {
      var pattern = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%&_])(?=\S+$).{8,20}$/;
      if (!fields.password.match(pattern)) {
        return res.status(400).json({
          error:
            "The password must be 8 to 20 characters long and must contain atleast one lower case, one uppercase, one special character(@,#,$,%,&,_) and one digit.",
        });
      }
    }

    if (files.photo) {
      if (files.photo.size > 1000000) {
        return res
          .status(400)
          .json({ error: "Image size cannot exceed size of 1 MB." });
      }
      user.photo.data = fs.readFileSync(files.photo.path);
      user.photo.contentType = files.photo.type;
    }
    user.save((err, result) => {
      if (err) {
        return res.status(500).json({ error: errorHandler(err) });
      } else {
        user.hashed_password = undefined;
        user.salt = undefined;
        user.photo = undefined;
        res.json(user);
      }
    });
  });
};

exports.profilePhotoController = (req, res) => {
  const username = req.params.username;
  User.findOne({ username }).exec((err, user) => {
    if (err) {
      return res.status(500).json({ error: errorHandler(err) });
    } else if (!user) {
      return res.status(404).json({ error: "User doesn't exist." });
    } else {
      if (user.photo.data) {
        res.set("Content-Type", user.photo.contentType);
        return res.send(user.photo.data);
      }
    }
  });
};
