const userRouter = require("./user.js");
const otpRouter = require("./otp.js");
function route(app) {
  app.use("/api/user", userRouter);
  app.use("/api/otp", otpRouter);
}

module.exports = route;
