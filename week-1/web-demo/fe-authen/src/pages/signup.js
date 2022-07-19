import React, { useRef, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

export default function SignUp() {
  const [isUsernameExist, setIsUsernameExist] = useState(false);
  const [isEmailExist, setIsEmailExist] = useState(false);
  const [isValidEmail, setIsValidEmail] = useState(true);

  const checkUsernameExist = (username) => {
    axios
      .post("http://localhost:5000/api/user/exist-username", {
        username: username,
      })
      .then((data) => {
        // console.log(data.data.find);
        if (data.data.find === true) {
          setIsUsernameExist(true);
          toast("Username is exist!");
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
          toast("Email is exist!");
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
        toast("Signup successfully!");
      })
      .catch((error) => {});
  };

  const pageRef = {
    username: useRef(null),
    email: useRef(null),
    password: useRef(null),
  };

  const emailCheckComp = () => {
    if (isEmailExist) {
      return <p className="error-input">Email is exist</p>;
    } else if (!isValidEmail) {
      return <p className="error-input">Email is not valid</p>;
    } else return null;
  };

  return (
    <div className="app-container">
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
    </div>
  );
}
