const { Item, BasketItem } = require("../models/schemas.js");

exports.getProductsPage = async (req, res, next) => {
  try {
    const foundItems = await Item.find();
    res.render("products", { foundItems: foundItems });
  } catch (err) {
    next(err);
  }
};

exports.sortItems = async (req, res, next) => {
  try {
    const items = Item.find();
    const sortedArray = await items.sort(req.query.sortType);
    res.render("products", { foundItems: sortedArray });
  } catch (err) {
    next(err);
  }
};

exports.getItemPage = async (req, res, next) => {
  try {
    const foundItem = await Item.findOne({ name: req.params.itemName });
    res.render("product-page", { item: foundItem });
  } catch (err) {
    next(err);
  }
};

exports.addBasketItem = async (req, res, next) => {
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
    next(err);
  }
};

exports.checkBasketAuth = (req, res, next) => {
  if (!req.isAuthenticated()) return res.redirect("/log-in");
  next();
};

// exports.basketItemsQuantity = (req, res, next) => {
//   if (req.isAuthenticated()) {
//     BasketItem.find({ userId: req.user._id }, (err, basketItems) => {
//       if (!err) {
//         res.locals.basketItemNumber = basketItems.length.toString();
//         console.log(basketItems.length);
//       }
//     });
//   } else {
//     res.locals.basketItemNumber = "0";
//   }
//   next();
// }
