const express = require("express");
const router = express.Router();
const { BasketItem } = require("../models/schemas.js");

router.get("/", (req, res) => {
  if (req.isAuthenticated()) {
    res.render("account", {
      username: req.user.username,
      name: req.user.name,
      address: req.user.address,
    });
  } else {
    res.redirect("/log-in");
  }
});

router.get("/basket", (req, res) => {
  if (req.isAuthenticated()) {
    BasketItem.find({ userId: req.user._id }, (err, basketItems) => {
      if (!err) {
        if (basketItems) res.json(basketItems);
      } else {
        console.error(err);
      }
    });
  } else {
    res.redirect("/log-in");
  }
});

router.post("/deleteAll", (req, res) => {
  BasketItem.deleteMany({ userId: req.user._id }, (err) => {
    if (!err) {
      res.end();
    }
  });
});

router.post("/deleteItem", (req, res) => {
  BasketItem.deleteOne(
    { userId: req.user._id, itemName: req.body.itemName },
    (err) => {
      if (!err) {
        res.end();
      }
    }
  );
});

module.exports = router;
