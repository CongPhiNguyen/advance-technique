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
          toast("Login success!");
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

  const loginHandle = () => {
    checkUserExist(pageRef.usernameRef.current.value);
  };

  const pageRef = {
    usernameRef: useRef(null),
    passwordRef: useRef(null),
  };

  return (
    <div className="app-container">
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
    </div>
  );
}

export default Login;
