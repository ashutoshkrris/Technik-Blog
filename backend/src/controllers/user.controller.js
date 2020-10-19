const User = require("../models/users.model");

exports.readController = (req, res) => {
    req.profile.hashed_password = undefined
    return res.json(req.profile)
  }
  