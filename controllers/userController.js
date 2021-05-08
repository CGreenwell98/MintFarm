const { User } = require("../models/schemas.js");
const passport = require("passport");
const AppError = require("../utils/appError");

exports.getLogInPage = (req, res) => {
  res.render("login");
};

exports.logInUser = (req, res, next) => {
  const user = new User({
    username: req.body.username,
    password: req.body.password,
  });

  passport.authenticate("local", function (err, user) {
    if (err) return next(err);
    if (!user) return res.redirect("/log-in");

    req.logIn(user, function (err) {
      if (err) return next(err);
      return res.redirect("/account");
    });
  })(req, res, next);
};

exports.getRegisterPage = (req, res) => {
  res.render("register");
};

exports.registerUser = async (req, res, next) => {
  try {
    const newUser = {
      name: req.body.name,
      address: req.body.address,
      username: req.body.username,
    };
    const userExists = await User.findOne({ username: newUser.username });
    if (userExists) return next(new AppError("User already exists", 400));

    await User.register(newUser, req.body.password, (err) => {
      if (err) return next(err);
      passport.authenticate("local")(req, res, () => {
        res.redirect("/account");
      });
    });
  } catch (err) {
    next(err);
  }
};

exports.logoutUser = (req, res) => {
  req.logout();
  res.redirect("/");
};
