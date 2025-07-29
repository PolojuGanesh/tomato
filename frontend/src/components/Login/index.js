import React, { useState } from "react";
import Cookies from "js-cookies";

import "./index.css";
import { assets } from "../../assets/frontend_assets/assets";

const Login = (props) => {
  const [formCurrentState, setFormCurrentState] = useState("Sign Up");
  const [data, setData] = useState({
    name: "",
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

    // const loginUserData = {
    //   email: data.email,
    //   password: data.password,
    // };

    // const registerUserData = {
    //   username: data.name,
    //   email: data.email,
    //   password: data.password,
    // };

    // const bodyData =
    //   formCurrentState === "Login" ? loginUserData : registerUserData;

    const options = {
      method: "POST",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" },
    };

    const response = await fetch(url, options);
    const responseData = await response.json();

    if (response.ok) {
      console.log(responseData)
    } else {
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
              name="name"
              onChange={onChangeHandler}
              value={data.name}
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
            Create a new account?
            <span onClick={() => setFormCurrentState("Sign Up")}>
              Click here
            </span>
          </p>
        ) : (
          <p>
            Already have an account?
            <span onClick={() => setFormCurrentState("Login")}>Login here</span>
          </p>
        )}
      </form>
    </div>
  );
};

export default Login;
