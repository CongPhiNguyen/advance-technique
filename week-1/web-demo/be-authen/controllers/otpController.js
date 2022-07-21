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

var sendMailOTP = (email, code, qrCodeURL) => {
  var mailOptions = {
    from: "phiroudnodemailer@gmail.com",
    to: email,
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
};

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

    QRCode.toDataURL(code)
      .then((url) => {
        console.log(url);
        sendMailOTP(req.body.email, code, url);
        let newOTP = new otp({
          username: req.body.username,
          email: req.body.email,
          time: new Date(),
          otpString: code,
        });
        user
          .findOneAndUpdate({ email: req.body.email }, { verified: true })
          .then((data) => {})
          .catch((err) => {
            return res.status(400).send({
              error: err.message,
              success: false,
            });
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

  checkOTP = async (username, otpCode, time) => {
    //TODO: handle trường hợp chưa nhấn nút send OTP
    return await otp
      .findOne({ username: username })
      .then((data) => {
        if (data == null) {
          return {
            success: false,
            userExist: false,
            otpExpired: false,
            error: false,
          };
        } else {
          if (data.otpString === otpCode) {
            const clientTime = new Date(req.body.time).getTime();
            const serverTime = new Date(data.time).getTime();
            if (clientTime - serverTime > TIME_OUT) {
              return {
                success: false,
                userExist: true,
                otpExpired: true,
                error: false,
              };
            } else {
              return {
                success: true,
                userExist: true,
                otpExpired: false,
                error: false,
              };
            }
          }
        }
      })
      .catch((error) => {
        return {
          success: true,
          userExist: false,
          otpExpired: false,
          error: true,
        };
      });
  };
}

module.exports = new otpController();
