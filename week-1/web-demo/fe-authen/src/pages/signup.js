import React, { useRef, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

export default function SignUp(props) {
  const [isUsernameExist, setIsUsernameExist] = useState(false);
  const [isEmailExist, setIsEmailExist] = useState(false);
  const [isValidEmail, setIsValidEmail] = useState(true);
  const [signUpState, setSignUpState] = useState("signup");
  const [countDownTime, setCountDownTime] = useState(0);
  const checkUsernameExist = (username) => {
    axios
      .post("http://localhost:5000/api/user/exist-username", {
        username: username,
      })
      .then((data) => {
        // console.log(data.data.find);
        if (data.data.find === true) {
          setIsUsernameExist(true);
        } else {
          setIsUsernameExist(false);
        }
      })
      .catch((error) => {
        // console.log(error.response.status === 404);
        toast(error.message);
        // if (error.response.status === 404) {
        //   setIsUsernameExist(false);
        // }
      });
  };

  const checkValidEmailFormat = (email) => {
    let checkRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (checkRegex.test(email)) {
      setIsValidEmail(true);
    } else {
      setIsValidEmail(false);
    }
  };

  const checkEmailExist = (email) => {
    axios
      .post("http://localhost:5000/api/user/exist-email", {
        email: email,
      })
      .then((data) => {
        // console.log(data.data.find);
        if (data.data.find === true) {
          setIsEmailExist(true);
        } else {
          setIsEmailExist(false);
        }
      })
      .catch((error) => {
        // console.log(error.response.status === 404);
        toast(error.message);
        // if (error.response.status === 404) {
        //   setIsUsernameExist(false);
        // }
      });
  };

  const signupUser = (username, email, password) => {
    if (username.length == 0 || password.length == 0) {
      toast("You must input all the information");
      return;
    }
    axios
      .post("http://localhost:5000/api/user/sign-up", {
        email: email,
        username: username,
        password: password,
      })
      .then((data) => {
        console.log("data", data);
        sendOTP(username, email);
        setCurrentUsername(username);
        pageRef.username.current.value = "";
        setCurrentStep(2);
        // toast("Signup successfully!");
      })
      .catch((error) => {
        console.log(error);
        toast("Signup failed!");
      });
  };

  const sendOTP = (username, email) => {
    axios
      .post("http://localhost:5000/api/otp/make-otp-sign-up", {
        username: username,
        email: email,
      })
      .then((data) => {
        if (data.data.success == true) {
          let timeCountDown = Math.round(
            60 - (new Date() - new Date(data.data.time).getTime()) / 1000
          );
          setCountDownTime(timeCountDown);
          let timeID = setInterval(() => {
            console.log(countDownTime);
            setCountDownTime((prevVal) => {
              if (prevVal == 0) clearInterval(timeID);
              return prevVal - 1;
            });
          }, 1000);
        }
      })
      .catch((error) => {
        toast(error.message);
      });
  };

  const pageRef = {
    username: useRef(null),
    email: useRef(null),
    password: useRef(null),
    otpRef: useRef(null),
  };

  const emailCheckComp = () => {
    if (isEmailExist) {
      return <p className="error-input">Email is exist</p>;
    } else if (!isValidEmail) {
      return <p className="error-input">Email is not valid</p>;
    } else return null;
  };

  const [currentStep, setCurrentStep] = useState(1);
  const [currentUsername, setCurrentUsername] = useState("");
  const submitOTP = (username, otp) => {
    // console.log(otp);
    axios
      .post("http://localhost:5000/api/otp/check-otp", {
        username: username,
        otp: otp,
        time: new Date(),
      })
      .then((data) => {
        console.log(data.data);
        if (data.data.success == true) {
          toast("Authentication OK");
          props.changeComponent("home");
        } else {
          toast(data.data.message);
        }
      })
      .catch((error) => {
        toast(error.message);
      });
  };

  return (
    <div className="app-container">
      <div className="step-container">
        <div
          className={currentStep == 1 ? "step step-1 current" : "step step-1"}
        >
          Sign up
        </div>
        <div className="connector"></div>
        <div
          className={currentStep == 2 ? "step step-2 current" : "step step-2"}
        >
          OTP
        </div>
      </div>
      {currentStep === 1 ? (
        <div className="login-container">
          <h1 className="login-title">SIGN UP</h1>
          <div className="input-container">
            <label htmlFor="username" className="input-title">
              Username
            </label>
            <input
              type="text"
              id="username"
              class="input-box"
              ref={pageRef.username}
              onBlur={() => {
                checkUsernameExist(pageRef.username.current.value);
              }}
            />
          </div>
          {isUsernameExist ? (
            <p className="error-input">Username is exist</p>
          ) : null}
          <div className="input-container">
            <label htmlFor="username" className="input-title">
              Email
            </label>
            <input
              type="email"
              id="email"
              class="input-box"
              ref={pageRef.email}
              onBlur={() => {
                checkEmailExist(pageRef.email.current.value);
                checkValidEmailFormat(pageRef.email.current.value);
              }}
            />
          </div>
          {emailCheckComp()}
          <div className="input-container">
            <label htmlFor="password" className="input-title">
              Password
            </label>
            <input
              type="password"
              id="password"
              class="input-box"
              ref={pageRef.password}
            />
          </div>
          <button
            className="login-button"
            onClick={() => {
              signupUser(
                pageRef.username.current.value,
                pageRef.email.current.value,
                pageRef.password.current.value
              );
            }}
          >
            SIGN UP
          </button>
        </div>
      ) : (
        <div className="otp-container">
          <h1 className="otp-title">OTP</h1>
          <div className="input-container">
            <label htmlFor="otp" className="input-title">
              OTP
            </label>
            <input
              type="text"
              id="otp"
              class="input-box"
              ref={pageRef.otpRef}
              defaultValue=""
            />
          </div>
          {countDownTime > 0 ? (
            <p className="count-down">OTP valid in {countDownTime} seconds</p>
          ) : null}
          <button
            className="send-otp-button"
            onClick={() =>
              submitOTP(currentUsername, pageRef.otpRef.current.value)
            }
          >
            Submit
          </button>
        </div>
      )}
    </div>
  );
}
