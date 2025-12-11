import React, { useContext, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Context } from "../main";
import axios from "axios";
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { isAuthenticated, setIsAuthenticated } = useContext(Context);

  const navigateTo = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await axios
        .post(
          "https://hms-backend-el2ugz27j-subhajitmaity123s-projects.vercel.app/v1/user/doctor/login",
          { email, password, role: "Doctor" },
          {
            withCredentials: true,
            headers: { "Content-Type": "application/json" },
          }
        )
        .then((res) => {
          toast.success(res.data.message);
          setIsAuthenticated(true);
          navigateTo("/");
          setEmail("");
          setPassword("");
        });
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  if (isAuthenticated) {
    return <Navigate to={"/"} />;
  }

  return (
    <div className="login-page">
      <div className="login-container">
        <section className="login-form">
          <img src="/logo.png" alt="logo" className="login-logo" />
          <h1 className="login-title">Welcome to Maity Care</h1>
          <p className="login-subtitle">Only Doctors Are Allowed To Access These Resources</p>
          
          <form onSubmit={handleLogin} className="login-form-content">
            <div className="form-group">
              <input
                type="text"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input"
              />
            </div>
            <button type="submit" className="login-button">
              Login
            </button>
          </form>
        </section>
      </div>
    </div>
  );
};

export default Login;