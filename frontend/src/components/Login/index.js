import React, { useState } from "react";
import Cookies from "js-cookies";
import { toast } from "react-toastify";

import { assets } from "../../assets/frontend_assets/assets";

import "./index.css";

const Login = (props) => {
  const [formCurrentState, setFormCurrentState] = useState("Sign Up");
  const [data, setData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData((data) => ({ ...data, [name]: value }));
  };

  const formDataHandler = async (event) => {
    event.preventDefault();
    let url = "http://localhost:4000";

    if (formCurrentState === "Login") {
      url += "/login";
    } else {
      url += "/register";
    }

    const options = {
      method: "POST",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" },
    };

    const response = await fetch(url, options);

    if (response.ok) {
      const responseData = await response.json();
      console.log(responseData);
      setData({
        username: "",
        email: "",
        password: "",
      });
      toast.success(`${responseData.message}`);
      Cookies.setItem("jwt_token", responseData.jwtToken, { expires: 7 });
    } else {
      const responseData = await response.json();
      toast.error(`${responseData.message}`);
    }
  };

  const { setShowLogin } = props;

  return (
    <div className="login-main-container">
      <form onSubmit={formDataHandler} className="form-main-container">
        <div className="title-and-cross-container">
          <h2>{formCurrentState}</h2>
          <img
            onClick={() => setShowLogin(false)}
            src={assets.cross_icon}
            alt=""
          />
        </div>
        <div className="form-input-fields-container">
          {formCurrentState === "Login" ? (
            <></>
          ) : (
            <input
              type="text"
              required
              placeholder="John"
              name="username"
              onChange={onChangeHandler}
              value={data.username}
            />
          )}
          <input
            type="email"
            required
            placeholder="john@gmail.com"
            name="email"
            onChange={onChangeHandler}
            value={data.email}
          />
          <input
            type="password"
            required
            placeholder="Password"
            name="password"
            onChange={onChangeHandler}
            value={data.password}
          />
        </div>
        <button type="submit">
          {formCurrentState === "Sign Up" ? "Create Account" : "Login"}
        </button>
        <div className="login-checkbox-and-conditions-container">
          <input type="checkbox" required />
          <p>By continuing, I agree to the terms of use & privacy policy.</p>
        </div>
        {formCurrentState === "Login" ? (
          <p>
            Create a new account?{" "}
            <span onClick={() => setFormCurrentState("Sign Up")}>
              Click here
            </span>
          </p>
        ) : (
          <p>
            Already have an account?{" "}
            <span onClick={() => setFormCurrentState("Login")}>Login here</span>
          </p>
        )}
      </form>
    </div>
  );
};

export default Login;
