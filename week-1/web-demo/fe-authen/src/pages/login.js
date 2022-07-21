import React, { useState, useRef } from "react";
import "./login.scss";
import axios from "axios";
import { toast } from "react-toastify";
import ReCAPTCHA from "react-google-recaptcha";
// TODO: put here into enviroment varibale
const CAPTCHA_SITE_KEY = "6LcjxgkhAAAAAHIhfKuWWgc07YASZozNywrkQM_6";
const CAPTCHA_SECRET_KEY = "6LcjxgkhAAAAAMZvHXuGUUIV--2dNrP9sjKzbh1i";

// TODO: count login attempt
function Login(props) {
  // Variable
  const [isUsernameExist, setIsUsernameExist] = useState(true);
  const [isValidPassword, setIsValidPassword] = useState(false);
  const [failedPasswordMessage, setFailedPasswordMessage] = useState("");
  const [countDownTime, setCountDownTime] = useState(0);
  const [captchaVerify, setCaptchaVerify] = useState(false);
  const [errorCaptcha, setErrorCaptcha] = useState(false);
  const [loginAttempt, setLoginAttempt] = useState(false);
  // Ref
  const pageRef = {
    usernameRef: useRef(null),
    passwordRef: useRef(null),
    otpRef: useRef(null),
  };

  // Captcha section
  const captchaChange = (value) => {
    console.log("Captcha verified!");
    setCaptchaVerify(true);
  };
  const captchaExpire = (value) => {
    toast("Captcha expired!");
    console.log("Captcha expired!");
    setCaptchaVerify(false);
  };
  const captchaError = (value) => {
    setErrorCaptcha(true);
  };

  // Validation section
  const checkUserExist = async (username) => {
    return await axios
      .post("http://localhost:5000/api/user/exist-username", {
        username: username,
      })
      .then((data) => {
        if (data.data.find === false) {
          setIsUsernameExist(false);
          return false;
        } else {
          setIsUsernameExist(true);
          return true;
        }
      })
      .catch((error) => {
        toast(error.message);
        return false;
      });
  };

  const checkValidatePassword = (password) => {
    if (password.length < 8) {
      setFailedPasswordMessage("Password must has 8 or more characters.");
      setIsValidPassword(false);
      return false;
    }
    //NOTE: Add more validate password constraint here
    setIsValidPassword(true);
    return true;
  };

  // Login and otp section
  const checkCorrectLoginInfo = async (username, password, otp) => {
    await axios
      .post("http://localhost:5000/api/user/check-login-info", {
        username: username,
        password: password,
        otp: otp,
        time: new Date(),
      })
      .then((data) => {
        if (data.data.success === true) {
          toast("Login successfully");
          props.changeComponent("home");
        } else {
          toast("Login failed");
        }
      })
      .catch((error) => {
        toast("Login failed!");
      });
  };

  const sendOTP = async (username) => {
    if (countDownTime > 0) {
      return;
    }
    let userExist = await checkUserExist(pageRef.usernameRef.current.value);
    if (!isUsernameExist || !userExist) {
      toast("Username is not exist");
      return;
    }
    if (!captchaVerify) {
      toast("You must verify the captcha before request OTP");
      return;
    }

    axios
      .post("http://localhost:5000/api/otp/make-otp-login", {
        username: username,
      })
      .then((data) => {
        let timeCountDown = Math.round(
          60 - (new Date() - new Date(data.data.time).getTime()) / 1000
        );
        setCountDownTime(timeCountDown);
        let timeID = setInterval(() => {
          setCountDownTime((prevVal) => {
            if (prevVal === 0) clearInterval(timeID);
            return prevVal - 1;
          });
        }, 1000);
      })
      .catch((err) => console.log(err));
  };

  const loginHandle = async () => {
    const userExist = await checkUserExist(pageRef.usernameRef.current.value);
    // Check constraint to login here
    if (!userExist) {
      toast("Username is not exist");
      return;
    }

    if (!isValidPassword) {
      toast("Password is not valid");
      return;
    }

    checkCorrectLoginInfo(
      pageRef.usernameRef.current.value,
      pageRef.passwordRef.current.value,
      pageRef.otpRef.current.value
    );
    // submitOTP();
  };

  return (
    <div className="app-container">
      <div className="login-container">
        <h1 className="login-title">LOGIN</h1>

        {/* input */}
        <div className="input-container">
          <label htmlFor="username" className="input-title">
            Username
          </label>
          <input
            type="text"
            id="username"
            className="input-box"
            ref={pageRef.usernameRef}
            onBlur={() => {
              checkUserExist(pageRef.usernameRef.current.value);
            }}
          />
        </div>
        {!isUsernameExist ? (
          <p className="error-input">Username is not exist</p>
        ) : null}
        <div className="input-container">
          <label htmlFor="password" className="input-title">
            Password
          </label>
          <input
            type="password"
            id="password"
            className="input-box"
            ref={pageRef.passwordRef}
            onBlur={() =>
              checkValidatePassword(pageRef.passwordRef.current.value)
            }
          />
        </div>
        {!isValidPassword ? (
          <p className="error-input">{failedPasswordMessage}</p>
        ) : null}

        {/* Captcha */}
        {captchaError ? (
          <p className="note-captcha">
            Incase captcha didn't show up, please <a href="/">refesh</a> the
            page
          </p>
        ) : null}

        <div className="captcha-container">
          <ReCAPTCHA
            sitekey={CAPTCHA_SITE_KEY}
            onChange={captchaChange}
            onExpired={captchaExpire}
            onError={captchaError}
          />
        </div>

        <div className="input-container">
          <label htmlFor="otp" className="input-title">
            OTP
          </label>
          <div className="input-concrete">
            <input
              type="text"
              id="otp"
              className="input-box"
              ref={pageRef.otpRef}
              defaultValue=""
            />
            <button
              className={
                isUsernameExist && countDownTime <= 0 && captchaVerify
                  ? "send-otp-button"
                  : "send-otp-button disable"
              }
              onClick={() => {
                if (isUsernameExist && countDownTime <= 0 && captchaVerify)
                  sendOTP(pageRef.usernameRef.current.value);
              }}
            >
              Send
            </button>
          </div>
        </div>
        {countDownTime > 0 ? (
          <p className="count-down">OTP valid in {countDownTime} seconds</p>
        ) : null}

        <button className="login-button" onClick={() => loginHandle()}>
          Login
        </button>
      </div>
    </div>
  );
}

export default Login;
