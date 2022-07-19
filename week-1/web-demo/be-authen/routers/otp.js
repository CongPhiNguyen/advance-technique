const express = require("express");
const otpController = require("../controllers/otpController");
const router = express.Router();

router.post("/make-otp-login", otpController.makeOTPLogin);
router.post("/make-otp-sign-up", otpController.makeOTPSignUp);
router.post("/check-otp", otpController.checkOTP);

module.exports = router;
