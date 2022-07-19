const otp = require("../models/otp");
const user = require("../models/user");

const crypto = require("crypto");
const bcrypt = require("bcrypt");
const TIME_OUT = 1000 * 60 * 1;
const nodemailer = require("nodemailer");
var QRCode = require("qrcode");

var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "phiroudnodemailer@gmail.com",
    pass: "yrrtytdsnrsyyrhc",
  },
});

class otpController {
  makeOTPLogin = async (req, res) => {
    console.log(req.body);
    let userData = await user.findOne({ username: req.body.username });

    let code = crypto.randomBytes(4).toString("hex");

    let qrCodeURL;
    QRCode.toDataURL(code)
      .then((url) => {
        console.log(url);
        qrCodeURL = url;
        var mailOptions = {
          from: "phiroudnodemailer@gmail.com",
          to: userData.email,
          subject: "QR CODE",
          text: `Code : ${code}`,
          html: `Code: ${code}. <br/> You can also use the qrcode bellow`,
          attachments: [
            {
              filename: "image.png",
              path: qrCodeURL,
              cid: "qrcode", //same cid value as in the html img src
            },
          ],
        };
        console.log(mailOptions.html);
        // });
        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            console.log(error);
          } else {
            console.log("Email sent: " + info.response);
          }
        });

        otp
          .findOneAndUpdate(
            { username: req.body.username },
            { time: new Date(), otpString: code }
          )
          .then((data) => {
            res.status(200).send({
              success: true,
              error: false,
              time: new Date(),
            });
          })
          .catch((err) => {
            res.status(400).send({
              error: err.message,
              success: false,
            });
          });
      })
      .catch((err) => {
        console.error(err);
      });
  };

  makeOTPSignUp = (req, res) => {
    console.log(req.body);

    let code = crypto.randomBytes(4).toString("hex");

    let qrCodeURL;
    QRCode.toDataURL(code)
      .then((url) => {
        console.log(url);
        qrCodeURL = url;
        var mailOptions = {
          from: "phiroudnodemailer@gmail.com",
          to: req.body.email,
          subject: "QR CODE",
          text: `Code : ${code}`,
          html: `Code: ${code}. <br/> You can also use the qrcode bellow`,
          attachments: [
            {
              filename: "image.png",
              path: qrCodeURL,
              cid: "qrcode", //same cid value as in the html img src
            },
          ],
        };
        console.log(mailOptions.html);
        // });
        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            console.log(error);
          } else {
            console.log("Email sent: " + info.response);
          }
        });
        let newOTP = new otp({
          username: req.body.username,
          email: req.body.email,
          time: new Date(),
          otpString: code,
        });

        newOTP
          .save()
          .then((data) => {
            res.status(200).send({
              success: true,
              error: false,
              time: new Date(),
            });
          })
          .catch((err) => {
            res.status(400).send({
              error: err.message,
              success: false,
            });
          });
      })
      .catch((err) => {
        console.error(err);
      });
  };

  checkOTP = (req, res) => {
    console.log("req.body", req.body);
    otp
      .findOne({ username: req.body.username })
      .then((data) => {
        if (data == null) {
          res.status(200).send({
            success: false,
            message: "Can''t find user",
          });
          return;
        } else {
          console.log(data);
          if (data.otpString === req.body.otp) {
            const clientTime = new Date(req.body.time).getTime();
            const serverTime = new Date(data.time).getTime();
            // console.log(-new Date(data.time).getTime());
            if (clientTime - serverTime > TIME_OUT) {
              res.status(200).send({
                success: false,
                message: "Time out",
              });
            } else {
              res.status(200).send({
                success: true,
                message: "Authentication OK",
              });
              return;
            }
          }
        }
      })
      .catch((error) => {
        res.status(200).send({
          success: false,
          message: "Some error happended",
        });
        return;
      });
  };
}

module.exports = new otpController();
