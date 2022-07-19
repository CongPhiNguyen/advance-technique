const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const otpSchema = new Schema({
  username: String,
  email: String,
  time: Date,
  otpString: String,
});

module.exports = mongoose.model("otp", otpSchema);
