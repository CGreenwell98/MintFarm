const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const passportConfig = require("./config/passport-config.js");

const productRoutes = require("./routes/productRoutes.js");
const userRoutes = require("./routes/userRoutes.js");
const accountRoutes = require("./routes/accountRoutes.js");

require("dotenv").config();

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

mongoose
  .connect(
    "mongodb+srv://admin-chris:" +
      process.env.PASSWORD_DB +
      "@cluster0.jxlvl.mongodb.net/MintFarmDB",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .catch((err) => console.error(err));
mongoose.set("useCreateIndex", true);

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

// app.use((req, res, next) => {
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
// });

// Routes

app.get("/", (req, res) => {
  res.render("index");
});

app.use("/", userRoutes);
app.use("/products", productRoutes);
app.use("/account", accountRoutes);

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
app.listen(port, () => console.log(`Listening on port ${port}`));
