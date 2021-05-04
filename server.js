const mongoose = require("mongoose");
require("dotenv").config();
const app = require("./app");

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
  .then(() => {
    console.log("DB connection successful");
  })
  .catch((err) => console.error(err));
mongoose.set("useCreateIndex", true);

let port = process.env.PORT;
if (port == null || port == "") port = 3000;
app.listen(port, () => console.log(`Listening on port ${port}`));
