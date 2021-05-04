const { Item, BasketItem } = require("../models/schemas.js");

exports.getProductsPage = (req, res) => {
  Item.find((err, foundItems) => {
    if (!err) {
      res.render("products", { foundItems: foundItems });
    }
  });
};

exports.sortItems = async (req, res) => {
  try {
    const items = Item.find();
    const sortedArray = await items.sort(req.query.sortType);
    res.render("products", { foundItems: sortedArray });
  } catch (err) {
    res.status(400);
  }
};

exports.getItemPage = (req, res) => {
  Item.findOne({ name: req.params.itemName }, (err, foundItem) => {
    if (!err) {
      res.render("product-page", { item: foundItem });
    }
  });
};

exports.addBasketItem = async (req, res) => {
  try {
    const foundItem = await Item.findOne({ name: req.params.itemName });

    // Checks if item is already in basket:
    const basketItem = await BasketItem.findOne({
      userId: req.user._id,
      itemName: req.params.itemName,
    });
    if (basketItem) return res.redirect("/account#basket");

    const quantity = req.body.quantity;
    let itemPrice = foundItem.price;
    if (quantity > 100) itemPrice = foundItem.bulkPrice;

    BasketItem.create({
      userId: req.user._id,
      itemName: foundItem.name,
      price: itemPrice,
      source: foundItem.source,
      quantity: quantity,
    });

    res.redirect("/products");
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: "Item not added",
    });
  }
};

exports.checkBasketAuth = (req, res, next) => {
  if (!req.isAuthenticated()) return res.redirect("/log-in");
  next();
};
