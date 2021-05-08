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

exports.getBasketItems = async (req, res, next) => {
  try {
    const basketItems = await BasketItem.find({ userId: req.user._id });
    if (basketItems) res.json(basketItems);
  } catch (err) {
    next(err);
  }
};

exports.deleteAllBasketItems = async (req, res, next) => {
  try {
    await BasketItem.deleteMany({ userId: req.user._id });
    res.end();
  } catch (err) {
    next(err);
  }
};

exports.deleteBasketItem = async (req, res, next) => {
  try {
    await BasketItem.deleteOne({
      userId: req.user._id,
      itemName: req.body.itemName,
    });
    res.end();
  } catch (err) {
    next(err);
  }
};
