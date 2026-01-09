/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import { API_ENDPOINTS } from "../../constants/API_ENDPOINTS";

import "./scss/login.scss";
import "./styles/Login.css";


const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    const payload = {
      email: email.trim(),
      password: password.trim(),
    }; 

    if (email === "admin@rushi.com") {
      if (password === "admin@123") {
        localStorage.setItem("user", JSON.stringify({ email, role: "admin" }));
        Swal.fire({
          icon: "success",
          title: "Welcome Admin",
          text: "Redirecting to Admin Dashboard...",
          timer: 2000,
          timerProgressBar: true,
        }).then(() => {
          navigate("/admin-dashboard");
        });
        return;
      } else {
        Swal.fire("Error", "Please enter a valid password", "error");
        return;
      }
    }

    try {
      // Send the payload to the backend
      const response = await axios.post(
        API_ENDPOINTS.LOGIN,
        payload 
      );

      const data = response.data;

      localStorage.setItem(
        "user",
        JSON.stringify({ email, role: "user", userId: data.userId })
      );

      Swal.fire({
        icon: "success",
        title: "Login Successful",
        text: "Welcome back!",
        timer: 2000,
        timerProgressBar: true,
      }).then(() => {
        navigate("/home");
      });
    } catch (err) {
      console.error("Login failed:", err);

      if (err.response && err.response.status === 401) {
        Swal.fire("Error", "Invalid email or password", "error");
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Something went wrong! Please try again.",
        });
      }
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="login">
        <div className="login-card">
          <div className="left">
            <h1>Helping Hands</h1>
            <p>
              Please log in using your credentials to access your personal
              dashboard, manage your fundraisers, and stay connected with the
              inspiring stories and updates from the causes you support.
            </p>
            <span>Don't you have an account?</span>
            <button
              onClick={() => {
                navigate("/register");
              }}
            >
              Register
            </button>
          </div>
          <div className="right">
            <h1>Login</h1>
            {error && <p className="error">{error}</p>}
            <form onSubmit={handleLogin}>
              <div className="form-group">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  required
                />
              </div>


              <button type="submit">Login</button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginForm;
