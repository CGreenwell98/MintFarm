const sort = require("../public/javascript/sorting.js");
const { Item, BasketItem } = require("../models/schemas.js");

exports.getProductsPage = (req, res) => {
  Item.find((err, foundItems) => {
    if (!err) {
      res.render("products", { foundItems: foundItems });
    }
  });
};

exports.sortItems = (req, res) => {
  Item.find((err, items) => {
    if (!err) {
      const sortType = req.body.checkbox;
      const sortedArray = sort.items(items, sortType);
      res.render("products", { foundItems: sortedArray });
    }
  });
};

exports.getItemPage = (req, res) => {
  Item.findOne({ name: req.params.itemName }, (err, foundItem) => {
    if (!err) {
      res.render("product-page", { item: foundItem });
    }
  });
};

exports.addBasketItem = (req, res) => {
  Item.findOne({ name: req.params.itemName }, (err, foundItem) => {
    if (err) return;

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
  });
};

exports.checkBasketAuth = (req, res, next) => {
  if (!req.isAuthenticated()) return res.redirect("/log-in");
  next();
};
