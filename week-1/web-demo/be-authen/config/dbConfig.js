const mongoose = require("mongoose");
const DATABASE_NAME = "authen-database";
const USER_NAME = "congphi";
const PASSWORD = "1";
const URI = `mongodb+srv://${USER_NAME}:${PASSWORD}@authen-app.snsagpn.mongodb.net/${DATABASE_NAME}`;

module.exports = connectDB = async () => {
  try {
    await mongoose.connect(URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connecting to DB successfully!");
  } catch (error) {
    console.error(error);
  }
};
