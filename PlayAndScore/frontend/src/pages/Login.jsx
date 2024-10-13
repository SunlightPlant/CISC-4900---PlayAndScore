import React from "react";
import { Link } from "react-router-dom";
import "./pages.css";

function Login() {
  return (
    <div className="logContainer">
      <h2 className="logh2">Log In</h2>
      <form className="logForm">
        <div>
          <label for="email">Email</label>
          <input type="email" name="email" placeholder="Email"></input>
        </div>
        <div>
          <label for="password">Password</label>
          <input type="password" name="password" placeholder="Password"></input>
        </div>
        <button type="submit" className="logButton">
          Login
        </button>
        <h4>
          Don't have an account created? <Link to="/register">Register</Link>
        </h4>
      </form>
    </div>
  );
}

export default Login;
