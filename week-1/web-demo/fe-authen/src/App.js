import "./App.css";
import "./app.scss";
import { useEffect } from "react";
// import { BrowserRouter } from "react-router-dom";
// import Routers from "./routes";
import Login from "./pages/login";
import { useState, useRef } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  const [appState, setAppState] = useState("login");
  useEffect(() => {
    document.title = "Login";
  });

  const loginRef = useRef();

  return (
    <div className="main-app-container">
      <div className="component-container">
        <Login />
      </div>
      <div className="component-navigation"></div>
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

export default App;
