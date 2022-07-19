const express = require("express");
const userController = require("../controllers/userController");
const router = express.Router();

router.get("/", userController.getUser);
router.post("/exist-username", userController.hasUsername);
router.post("/exist-email", userController.hasEmail);
router.post("/check-login-info", userController.checkLoginInfo);
router.post("/sign-up", userController.signUp);

module.exports = router;
