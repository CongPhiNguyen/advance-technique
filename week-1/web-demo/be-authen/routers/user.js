const express = require("express");
const userController = require("../controllers/userController");
const router = express.Router();

router.get("/", userController.getUser);
router.post("/exist-username", userController.hasUsername);
router.post("/check-login-info", userController.checkLoginInfo);
module.exports = router;
