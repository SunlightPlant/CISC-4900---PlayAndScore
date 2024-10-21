import React from "react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./pages.css";
import axios from "axios";

function Register() {
  const [values, setValues] = useState({
    email: "",
    password: "",
    username: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/register",
        values
      );
      alert(response.data.message);
    } catch (error) {
      console.log(error);
      alert(error.response.data.message);
    }
  };

  return (
    <div className="logContainer">
      <h2 className="logh2">Register Account</h2>
      <form className="logForm" onSubmit={(e) => handleSubmit(e)}>
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
        <div>
          <label for="username">Username</label>
          <input
            type="text"
            name="username"
            placeholder="Username"
            onChange={(e) =>
              setValues({ ...values, [e.target.name]: e.target.value })
            }
          ></input>
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
