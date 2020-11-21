
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose")
const ejs = require("ejs");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
require('dotenv').config()

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.use(session({
  secret: "MintFarm1998",
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

mongoose.connect("mongodb://localhost:27017/MintFarmDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
mongoose.set("useCreateIndex", true);

// Users

const userSchema = new mongoose.Schema({
  email: String,
  password: String
});

userSchema.plugin(passportLocalMongoose);

const User = new mongoose.model("User", userSchema);

passport.use(User.createStrategy());

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

// Items

const itemSchema = {
  name: String,
  price: Number,
  bulkPrice: Number,
  desc: String,
  source: String
};

const Item = mongoose.model("Item", itemSchema);

// Backet

const basketSchema = {
  userId: String,
  itemName: String,
  price: Number,
  source: String,
  quantity: Number
};

const BasketItem = mongoose.model("Basket Item", basketSchema);

// Navbar text change

app.use((req,res,next) => {
  if (req.isAuthenticated()) {
    res.locals.account = "Account";
  } else if (!req.isAuthenticated()) {
    res.locals.account = "Sign In";
  }
  next();
})

// Routes

app.get("/", (req, res) => {
  res.render("index")
});

app.get("/products", (req,res) => {
  Item.find((err, foundItems) => {
    if (!err) {
      res.render("products", {foundItems:foundItems})
    }
  })
})

app.route("/products/:itemName")
.get((req,res) => {
  Item.findOne({name:req.params.itemName}, (err, foundItem) => {
    if (!err) {
      res.render("product-page", {item:foundItem})
    }
  })
})
.post((req,res) => {
Item.findOne({name:req.params.itemName}, (err, foundItem) => {
  if (!err) {
    if (req.isAuthenticated()) {

      const quantity = req.body.quantity;
      let itemPrice = foundItem.price;
      if (quantity>100) {
        itemPrice = foundItem.bulkPrice;
      }

        const basketItem = new BasketItem ({
          userId: req.user._id,
          itemName: foundItem.name,
          price: itemPrice,
          source: foundItem.source,
          quantity: quantity
        });

        basketItem.save();
        res.redirect("/products");

    } else {
      res.redirect("/log-in")
    }
  }
})
});

app.route("/log-in")
.get((req,res) => {
  res.render("login")
})
.post((req,res) => {

  const user = new User({
    username:req.body.username,
    password:req.body.password
  });

  req.login(user, (err) => {
    if (err) {
      console.log(err);
      res.redirect("/log-in")
    } else {
      passport.authenticate("local")(req, res, () => {
        res.redirect("/account");
      });
    }
  });

});

app.route("/register")
.get((req,res) => {
  res.render("register")
})
.post((req,res) => {
  User.register({username:req.body.username}, req.body.password, (err, user) => {
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

app.route("/account")
.get((req,res) => {
  if (req.isAuthenticated()) {
    BasketItem.find({userId:req.user._id}, (err, basketItems) =>{
      if (!err) {
        res.render("account", {username: req.user.username, basketItems:basketItems})
      }
    })
  } else {
    res.redirect("/log-in")
  }
})
.post((req,res) => {
  BasketItem.deleteOne({userId:req.user._id}, {itemName:req.body.basketItemName}, (err) => {
    if (!err) {
      res.redirect("/account#basket")
    }
  })
});

app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

app.listen(3000, () => {
  console.log("Running: Port 3000")
})
