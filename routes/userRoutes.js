const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router
  .route("/log-in")
  .get(userController.getLogInPage)
  .post(userController.logInUser);

router
  .route("/register")
  .get(userController.getRegisterPage)
  .post(userController.registerUser);

router.get("/logout", userController.logoutUser);

module.exports = router;
