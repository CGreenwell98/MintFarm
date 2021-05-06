const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const passport = require("passport");
const passportConfig = require("./config/passport-config.js");

const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");
const productRoutes = require("./routes/productRoutes.js");
const userRoutes = require("./routes/userRoutes.js");
const accountRoutes = require("./routes/accountRoutes.js");

const app = express();

app.set("view engine", "ejs");

app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
  express.json()
);
app.use(express.static("public"));
app.use(
  session({
    secret: "MintFarm1998",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());
passportConfig();

// Navbar text change

app.use((req, res, next) => {
  if (req.isAuthenticated()) {
    res.locals.account = "Account";
  } else {
    res.locals.account = "Sign In";
  }
  next();
});

//  Navbar basket item number
// app.use(accountController.basketItemQuantity);

// Routes

app.get("/", (req, res) => {
  res.render("index");
});

app.use("/", userRoutes);
app.use("/products", productRoutes);
app.use("/account", accountRoutes);

app.all("*", (req, res, next) => {
  const err = new AppError(`Cant find ${req.originalUrl} on this server!`, 404);
  next(err);
});

app.use(globalErrorHandler);

module.exports = app;
