import "./App.css";
import "./app.scss";

function App() {
  return (
    <div className="app-container">
      <div className="login-container">
        <h1 className="login-title">Login</h1>
        <div className="input-container">
          <label htmlFor="username" className="username-title">
            Username
          </label>
          <input type="text" id="username" />
        </div>
        <button className="login-button">Login</button>
      </div>
    </div>
  );
}

export default App;
