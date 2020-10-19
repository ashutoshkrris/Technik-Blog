const User = require("../models/users.model");
const shortId = require("shortid");
const jwt = require("jsonwebtoken");
const expressJwt = require("express-jwt");


exports.signupController = (req, res) => {
  // check if user is already registered
  User.findOne({ email: req.body.email }).exec((err, user) => {
    if (user) {
      return res.status(403).json({ error: "User already exists" });
    }
    const { name, email, password, confirmPassword } = req.body;
    let username = shortId.generate();
    let profile = `${process.env.CLIENT_URL}/profile/${username}`;
    let newUser = new User({ name, email, password, profile, username });
    newUser.save((err, success) => {
      if (err) {
        return res
          .status(500)
          .json({ error: "We could not signup you, sorry!" });
      }
      res
        .status(200)
        .json({ message: "Signup Successful. You can now sign in." });
    });
  });
};

exports.loginController = (req, res) => {
  const { email, password } = req.body;

  // check if user exist
  User.findOne({ email }).exec((err, user) => {
    if (err || !user) {
      return res.status(404).json({ error: "User doesn't exist." });
    }
    // authenticate
    if (!user.authenticate(password)) {
      return res
        .status(401)
        .json({ error: "Email and Password do not match." });
    }
    // generate a token and send to client
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.cookie("token", token, { expiresIn: "7d" });
    const { _id, username, name, email, role } = user;
    return res.json({ token, user: { _id, username, name, email, role } });
  });
};

exports.logoutController = (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Logged out!" });
};

exports.protectedController = expressJwt({
  secret: process.env.JWT_SECRET,
  algorithms: ["HS256"]
});


exports.authMiddleware = (req, res, next) => {
  const authUserId = req.user._id
  User.findById({ _id: authUserId }).exec((err, user) => {
    if (err || !user) {
      return res.status(404).json({error: "User not found!!"})
    }
    req.profile = user
    next()
  })
}

exports.adminMiddleware = (req, res, next) => {
  const adminUserId = req.user._id
  console.log(adminUserId)
  User.findById({ _id: adminUserId }).exec((err, user) => {
    if (err || !user) {
      return res.status(404).json({error: "User not found!!"})
    }
    if (user.role !== 1) {
      return res.status(400).json({error: "You are not an admin!!"})
    }
    req.profile = user
    next()
  })
}