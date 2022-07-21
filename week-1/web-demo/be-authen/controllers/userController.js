const user = require("../models/user");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const SALT_ROUND = 10;
const otpController = require("./otpController");

// TODO: verified user when sign up
class userController {
  getUser = async (req, res) => {
    // console.log("req", req);
    // res.status(200).send({ run: true });
    await user
      .find()
      .exec()
      .then((data) => {
        res.status(200).send({ data: data });
      })
      .catch((error) => {
        console.log(error.message);
        res.status(200).send(JSON.stringify({ error: error.message }));
      });
  };

  hasUsername = async (req, res) => {
    console.log("req.body", req.body);
    let dataUser;
    try {
      dataUser = await user.find({ username: req.body.username }).exec();
      // console.log("dataUser", dataUser);
    } catch (error) {
      res.status(400).send({
        error: true,
        find: false,
      });
    }

    if (dataUser === null || dataUser.length == 0) {
      res.status(200).send({
        error: false,
        find: false,
      });
    } else {
      res.status(200).send({
        error: false,
        find: true,
      });
    }
  };

  hasEmail = async (req, res) => {
    // console.log("req.body", req.body);
    let dataUser;
    try {
      dataUser = await user.find({ email: req.body.email }).exec();
      // console.log("dataUser", dataUser);
    } catch (error) {
      res.status(400).send({
        error: true,
        find: false,
      });
    }

    if (dataUser === null || dataUser.length == 0) {
      res.status(200).send({
        error: false,
        find: false,
      });
    } else {
      res.status(200).send({
        error: false,
        find: true,
      });
    }
  };

  checkLoginInfo = async (req, res) => {
    console.log("req.body Login", req.body);
    const validateOTP = await otpController.checkOTP(
      req.body.username,
      req.body.otp,
      req.body.time
    );
    if (validateOTP.success) {
      let dataUser;
      try {
        dataUser = await user.findOne({ username: req.body.username }).exec();
        console.log("dataUser", dataUser);
      } catch (error) {
        res.status(400).send({
          error: true,
          success: false,
        });
      }
      if (dataUser === null || dataUser.length == 0) {
        res.status(200).send({
          error: false,
          success: false,
        });
      } else {
        if (
          bcrypt.compareSync(
            req.body.password + dataUser.salt,
            dataUser.password
          )
        )
          res.status(200).send({
            error: false,
            success: true,
          });
        else
          res.status(400).send({
            error: false,
            success: false,
          });
      }
    } else {
      res.status(400).send({
        error: true,
        success: false,
      });
    }
  };

  signUp = async (req, res) => {
    console.log("req.body", req.body);
    const salt = crypto.randomBytes(20).toString("hex");
    const hashPass = bcrypt.hashSync(req.body.password + salt, SALT_ROUND);
    try {
      const newUser = new user({
        email: req.body.email,
        password: hashPass,
        username: req.body.username,
        salt: salt,
      });
      newUser
        .save()
        .then((data) => {
          console.log("data", data);
          res.status(200).send({
            error: false,
            success: true,
          });
        })
        .catch((error) => {
          console.log("error.message", error.message);
          res.status(400).send({
            error: true,
            success: false,
          });
        });
    } catch (error) {
      res.status(400).send({
        error: true,
        success: false,
      });
    }
    // res.status(200).send({ run: true });
  };
}

module.exports = new userController();
