
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
  secret: SECRET,
  resave: false,
  saveUninitialized: false
}));

mongoose.connect("mongodb://localhost:27017/MintFarmDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const itemSchema = {
  name: String,
  price: Number,
  bulkPrice: Number,
  desc: String,
  source: String
};

const Item = mongoose.model("Item", itemSchema);

app.get("/", (req, res) => {
  res.render("index")
})

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

app.get("/log-in", (req,res) => {
  res.render("login")
});

app.listen(3000, () => {
  console.log("Running: Port 3000")
})
