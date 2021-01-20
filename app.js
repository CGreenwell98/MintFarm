const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");
const sort = require(__dirname + "/public/javascript/sorting.js");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
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

mongoose.connect(
  "mongodb+srv://admin-chris:" +
    process.env.PASSWORD_DB +
    "@cluster0.jxlvl.mongodb.net/MintFarmDB",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);
mongoose.set("useCreateIndex", true);

// Users

const userSchema = new mongoose.Schema({
  name: String,
  address: String,
  email: String,
  password: String,
});

userSchema.plugin(passportLocalMongoose);

const User = new mongoose.model("User", userSchema);

passport.use(User.createStrategy());

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

// Items

const itemSchema = {
  name: String,
  price: Number,
  bulkPrice: Number,
  desc: String,
  source: String,
};

const Item = mongoose.model("Item", itemSchema);

// Basket

const basketSchema = {
  userId: String,
  itemName: String,
  price: Number,
  source: String,
  quantity: Number,
};

const BasketItem = mongoose.model("Basket Item", basketSchema);

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

// app.use((req,res,next) => {
//   if (req.isAuthenticated()) {
//     BasketItem.find({userId:req.user._id}, (err, basketItems) =>{
//       if (!err) {
//         let count = 0;
//         basketItems.forEach( item => {
//           count = count + 1;
//         });
//         res.locals.basketItemNumber = count.toString();
//         console.log(res.locals.basketItemNumber);
//       }
//     });
//   } else {
//     res.locals.basketItemNumber = "0";
//   }
//   next();
// });

// Routes

app.get("/", (req, res) => {
  const googleMapsApi = process.env.API_SRC;
  res.render("index", { googleMapsApi: googleMapsApi });
});

// Product pages

app
  .route("/products")
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

app
  .route("/products/:itemName")
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
        res.redirect("/log-in");
      }
    });
  });

// Sign-in + Register

app
  .route("/log-in")
  .get((req, res) => {
    res.render("login");
  })
  .post((req, res, next) => {
    const user = new User({
      username: req.body.username,
      password: req.body.password,
    });

    passport.authenticate("local", function (err, user) {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.redirect("/log-in");
      }
      req.logIn(user, function (err) {
        if (err) {
          return next(err);
        }
        return res.redirect("/account");
      });
    })(req, res, next);
  });

app
  .route("/register")
  .get((req, res) => {
    res.render("register");
  })
  .post((req, res) => {
    const newUser = {
      name: req.body.name,
      address: req.body.address,
      username: req.body.username,
    };
    User.register(newUser, req.body.password, (err, user) => {
      if (err) {
        console.log(err);
        res.redirect("/register");
      } else {
        passport.authenticate("local")(req, res, () => {
          res.redirect("/account");
        });
      }
    });
  });

// Account page + Basket

app.get("/account", (req, res) => {
  if (req.isAuthenticated()) {
    res.render("account", {
      username: req.user.username,
      name: req.user.name,
      address: req.user.address,
    });
  } else {
    res.redirect("/log-in");
  }
});

app.get("/account/basket", (req, res) => {
  if (req.isAuthenticated()) {
    BasketItem.find({ userId: req.user._id }, (err, basketItems) => {
      if (!err) {
        if (basketItems) res.json(basketItems);
      } else {
        console.error(err);
      }
    });
  } else {
    res.redirect("/log-in");
  }
});

app.post("/account/deleteAll", (req, res) => {
  BasketItem.deleteMany({ userId: req.user._id }, (err) => {
    if (!err) {
      res.end();
    }
  });
});

app.post("/account/deleteItem", (req, res) => {
  BasketItem.deleteOne(
    { userId: req.user._id, itemName: req.body.itemName },
    (err) => {
      if (!err) {
        res.end();
      }
    }
  );
});

app.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
app.listen(port);
