const express = require("express");
const router = express.Router();
const sort = require("../public/javascript/sorting.js");
const { Item, BasketItem } = require("../models/schemas.js");

router
  .route("/")
  .get((req, res) => {
    Item.find((err, foundItems) => {
      if (!err) {
        res.render("products", { foundItems: foundItems });
      }
    });
  })
  // Item sorting:
  .post((req, res) => {
    Item.find((err, items) => {
      if (!err) {
        const sortType = req.body.checkbox;
        const sortedArray = sort.items(items, sortType);
        res.render("products", { foundItems: sortedArray });
      }
    });
  });

router
  .route("/:itemName")
  .get((req, res) => {
    Item.findOne({ name: req.params.itemName }, (err, foundItem) => {
      if (!err) {
        res.render("product-page", { item: foundItem });
      }
    });
  })
  // Add item to basket:
  .post((req, res) => {
    Item.findOne({ name: req.params.itemName }, (err, foundItem) => {
      if (err) return;
      if (req.isAuthenticated()) {
        // Checks if item is already in basket:
        BasketItem.findOne(
          { userId: req.user._id, itemName: req.params.itemName },
          (err, basketItem) => {
            if (err) return;
            if (basketItem) {
              res.redirect("/account#basket");
            } else {
              const quantity = req.body.quantity;
              let itemPrice = foundItem.price;
              if (quantity > 100) {
                itemPrice = foundItem.bulkPrice;
              }

              const basketItem = new BasketItem({
                userId: req.user._id,
                itemName: foundItem.name,
                price: itemPrice,
                source: foundItem.source,
                quantity: quantity,
              });

              basketItem.save();
              res.redirect("/products");
            }
          }
        );
      } else {
        res.redirect("/user/log-in");
      }
    });
  });

module.exports = router;
