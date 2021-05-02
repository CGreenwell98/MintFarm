const express = require("express");
const router = express.Router();
const { User } = require("../models/schemas.js");
const passport = require("passport");

router
  .route("/log-in")
  .get((req, res) => {
    res.render("login");
  })
  .post((req, res, next) => {
    const user = new User({
      username: req.body.username,
      password: req.body.password,
    });

    passport.authenticate("local", function (err, user) {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.redirect("/log-in");
      }
      req.logIn(user, function (err) {
        if (err) {
          return next(err);
        }
        return res.redirect("/account");
      });
    })(req, res, next);
  });

router
  .route("/register")
  .get((req, res) => {
    res.render("register");
  })
  .post((req, res) => {
    const newUser = {
      name: req.body.name,
      address: req.body.address,
      username: req.body.username,
    };
    User.register(newUser, req.body.password, (err, user) => {
      if (err) {
        console.log(err);
        res.redirect("/register");
      } else {
        passport.authenticate("local")(req, res, () => {
          res.redirect("/account");
        });
      }
    });
  });

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports = router;
