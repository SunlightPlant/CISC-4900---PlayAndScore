import React from "react";
import { Link } from "react-router-dom";
import "./pages.css";

function Register() {
  return (
    <div className="logContainer">
      <h2 className="logh2">Register Account</h2>
      <form className="logForm">
        <div>
          <label for="email">Email</label>
          <input type="email" name="email" placeholder="Email"></input>
        </div>
        <div>
          <label for="password">Password</label>
          <input type="password" name="password" placeholder="Password"></input>
        </div>
        <div>
          <label for="username">Username</label>
          <input type="text" name="username" placeholder="Username"></input>
        </div>
        <button type="submit" className="logButton">
          Register
        </button>
        <h4>
          Already have an account? <Link to="/login">Login</Link>
        </h4>
      </form>
    </div>
  );
}

export default Register;
