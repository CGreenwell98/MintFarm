const express = require("express");
const router = express.Router();
const accountController = require("../controllers/accountController");

router.use("/", accountController.checkAuth);

router.get("/", accountController.getAccountPage);
router.get("/basket", accountController.getBasketItems);
router.post("/deleteAll", accountController.deleteAllBasketItems);
router.post("/deleteItem", accountController.deleteBasketItem);

module.exports = router;
