import React from "react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import "./pages.css";
import axios from "axios";

function Login() {
  const [values, setValues] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/login", values);
      alert(response.data.message);
    } catch (error) {
      console.log(error);
      alert(error.response.data.message);
    }
  };

  return (
    <div className="logContainer">
      <h2 className="logh2">Log In</h2>
      <form className="logForm" onSubmit={handleSubmit}>
        <div>
          <label for="email">Email</label>
          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={(e) =>
              setValues({ ...values, [e.target.name]: e.target.value })
            }
          ></input>
        </div>
        <div>
          <label for="password">Password</label>
          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={(e) =>
              setValues({ ...values, [e.target.name]: e.target.value })
            }
          ></input>
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
