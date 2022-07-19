import "./App.css";
import "./app.scss";
import { useEffect } from "react";
// import { BrowserRouter } from "react-router-dom";
// import Routers from "./routes";
import Login from "./pages/login";
import { useState, useRef } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SignUp from "./pages/signup";
import Home from "./pages/home";
const App = () => {
  const [appState, setAppState] = useState("login");
  useEffect(() => {
    document.title = "Authentication Application";
  });

  const changeComponent = (component) => {
    setAppState(component);
  };

  return (
    <div className="main-app-container">
      <div className="component-navigation">
        <p
          className={appState == "login" ? "nav active" : "nav"}
          onClick={() => {
            setAppState("login");
          }}
        >
          Login
        </p>
        <p
          className={appState == "signup" ? "nav active" : "nav"}
          onClick={() => {
            setAppState("signup");
          }}
        >
          SignUp
        </p>
      </div>
      <div className="component-container">
        {appState == "login" ? (
          <Login changeComponent={(component) => changeComponent()} />
        ) : appState == "signup" ? (
          <SignUp changeComponent={(component) => changeComponent()} />
        ) : (
          <Home changeComponent={(component) => changeComponent()} />
        )}
      </div>

      <ToastContainer />
    </div>
  );
};

export default App;
