const user = require("../models/user");

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
      console.log("dataUser", dataUser);
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
    let dataUser;
    try {
      dataUser = await user
        .find({ username: req.body.username, password: req.body.password })
        .exec();
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
      res.status(200).send({
        error: false,
        success: true,
      });
    }
  };
}

module.exports = new userController();
