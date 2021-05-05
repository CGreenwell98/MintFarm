const express = require("express");
const router = express.Router();
const accountController = require("../controllers/accountController");

router.use("/", accountController.checkAuth);

router.get("/", accountController.getAccountPage);
router.get("/basket", accountController.getBasketItems);
router.delete("/deleteAll", accountController.deleteAllBasketItems);
router.delete("/deleteItem", accountController.deleteBasketItem);

module.exports = router;
