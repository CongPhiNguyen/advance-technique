import React, {
  useEffect,
  useState,
  useImperativeHandle,
  useRef,
  useInsertionEffect,
} from "react";
import "./login.scss";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

function Login(props) {
  // useEffect(() => {
  //   axios
  //     .get("http://localhost:5000/api/user", {})
  //     .then((data) => {
  //       console.log(data);
  //     })
  //     .catch((error) => {
  //       console.log(error.message);
  //     });
  //   // axios.post("http://localhost:5000/api/has-user",{})
  // });

  const [isUsernameExist, setIsUsernameExist] = useState(true);
  const [currentStep, setCurrentStep] = useState(1);
  const [currentUsername, setCurrentUsername] = useState("");
  const [countDownTime, setCountDownTime] = useState(0);

  // useImperativeHandle(ref, () => ({
  //   setUsernameExist() {
  //     setIsUsernameExist(false);
  //   },
  // }));

  const checkUserExist = async (username) => {
    await axios
      .post("http://localhost:5000/api/user/exist-username", {
        username: username,
      })
      .then((data) => {
        // console.log(data.data.find);
        if (data.data.find === false) {
          setIsUsernameExist(false);
          toast("Username is not exist!");
        } else {
          setIsUsernameExist(true);
          checkCorrectLoginInfo(
            pageRef.usernameRef.current.value,
            pageRef.passwordRef.current.value
          );
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

  const checkCorrectLoginInfo = async (username, password) => {
    await axios
      .post("http://localhost:5000/api/user/check-login-info", {
        username: username,
        password: password,
      })
      .then((data) => {
        // console.log(data.data.find);
        if (data.data.success === false) {
          toast("Password not match");
        } else {
          sendOTP(pageRef.usernameRef.current.value);
          setCurrentUsername(pageRef.usernameRef.current.value);
          setCurrentStep(2);
          pageRef.usernameRef.current.value = "";
        }
      })
      .catch((error) => {
        toast("Login failed!");
      });
  };

  const sendOTP = (username) => {
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
          console.log(countDownTime);
          setCountDownTime((prevVal) => {
            if (prevVal == 0) clearInterval(timeID);
            return prevVal - 1;
          });
        }, 1000);
      })
      .catch((err) => console.log(err));
  };

  const submitOTP = (username, otp) => {
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

  const loginHandle = () => {
    checkUserExist(pageRef.usernameRef.current.value);
  };

  const pageRef = {
    usernameRef: useRef(null),
    passwordRef: useRef(null),
    otpRef: useRef(null),
  };

  return (
    <div className="app-container">
      <div className="step-container">
        <div
          className={currentStep == 1 ? "step step-1 current" : "step step-1"}
        >
          Login
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
          <h1 className="login-title">LOGIN</h1>
          <div className="input-container">
            <label htmlFor="username" className="input-title">
              Username
            </label>
            <input
              type="text"
              id="username"
              class="input-box"
              ref={pageRef.usernameRef}
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
              class="input-box"
              ref={pageRef.passwordRef}
            />
          </div>
          <button className="login-button" onClick={() => loginHandle()}>
            Login
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

export default Login;
