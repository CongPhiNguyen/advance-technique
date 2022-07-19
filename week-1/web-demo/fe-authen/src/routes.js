import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import Login from "./pages/login.js";

const Routers = () => {
  // waiting
  const loading = (
    <div>
      <h1>Loading...</h1>
    </div>
  );
  return (
    <React.Suspense fallback={loading}>
      <Routes>
        <Route path="/login" name="Login" component={<Login />}></Route>
        <Route path="/" name="Login" component={<Login />}></Route>
      </Routes>
    </React.Suspense>
  );
};

export default Routers;
