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
}

module.exports = new userController();
