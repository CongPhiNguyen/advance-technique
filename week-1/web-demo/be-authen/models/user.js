const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: String,
  email: String,
  password: String,
  salt: String,
});

module.exports = mongoose.model("user", userSchema);
