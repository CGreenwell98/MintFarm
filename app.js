
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose")
const ejs = require("ejs");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");

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

app.get("/products/:itemName", (req,res) => {
  Item.findOne({name:req.params.itemName}, (err, foundItem) => {
    if (!err) {
      res.render("product-page", {item:foundItem})
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

app.get("/account", (req,res) => {
  if (req.isAuthenticated()) {
    res.render("account", {username: req.user.username})
  } else {
    res.redirect("/log-in")
  }
})

app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

app.listen(3000, () => {
  console.log("Running: Port 3000")
})
