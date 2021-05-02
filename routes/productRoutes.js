const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");

router
  .route("/")
  .get(productController.getProductsPage)
  .post(productController.sortItems);

router
  .route("/:itemName")
  .get(productController.getItemPage)
  .post(productController.checkBasketAuth, productController.addBasketItem);

module.exports = router;
