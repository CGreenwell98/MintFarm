const { BasketItem } = require("../models/schemas.js");

exports.checkAuth = (req, res, next) => {
  if (!req.isAuthenticated()) return res.redirect("/log-in");
  next();
};

exports.getAccountPage = (req, res) => {
  res.render("account", {
    username: req.user.username,
    name: req.user.name,
    address: req.user.address,
  });
};

exports.getBasketItems = (req, res) => {
  BasketItem.find({ userId: req.user._id }, (err, basketItems) => {
    if (!err) {
      if (basketItems) res.json(basketItems);
    } else {
      console.error(err);
    }
  });
};

exports.deleteAllBasketItems = (req, res) => {
  BasketItem.deleteMany({ userId: req.user._id }, (err) => {
    if (!err) {
      res.end();
    }
  });
};

exports.deleteBasketItem = (req, res) => {
  BasketItem.deleteOne(
    { userId: req.user._id, itemName: req.body.itemName },
    (err) => {
      if (!err) {
        res.end();
      }
    }
  );
};
