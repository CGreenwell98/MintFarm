const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

// Items:

const itemSchema = {
  name: String,
  price: Number,
  bulkPrice: Number,
  desc: String,
  source: String,
};

const Item = mongoose.model("Item", itemSchema);

// Basket:

const basketSchema = {
  userId: String,
  itemName: String,
  price: Number,
  source: String,
  quantity: Number,
};

const BasketItem = mongoose.model("Basket Item", basketSchema);

// Users

const userSchema = new mongoose.Schema({
  name: String,
  address: String,
  email: {
    type: String,
    required: [true, "E-mail address required"],
  },
  password: {
    type: String,
    required: [true, "Password required"],
  },
});

userSchema.plugin(passportLocalMongoose);

const User = new mongoose.model("User", userSchema);

module.exports = { Item, BasketItem, User };
