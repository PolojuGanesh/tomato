import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookies";

import { assets } from "../../assets/frontend_assets/assets";
import { StoreContext } from "../context/StoreContext";

import "./index.css";

const Navbar = (props) => {
  const [activeMenu, setActiveMenu] = useState("home");
  const { getSubTotalAmount, setJwtToken, setCartItems } =
    useContext(StoreContext);

  const { setShowLogin } = props;

  const jwtToken = Cookies.getItem("jwt_token");

  const navigate = useNavigate();

  const logoutHandler = () => {
    Cookies.removeItem("jwt_token");
    Cookies.removeItem("user_details");
    setJwtToken(null);
    setCartItems({});
    navigate("/");
  };

  const myordersHandler = () => {
    navigate("/myorders");
  };

  return (
    <div className="navbar-main-container">
      <Link to="/">
        <img className="navbar-logo" src={assets.logo} alt="" />
      </Link>
      <ul className="navbar-ul-container">
        <Link
          to="/"
          className={activeMenu === "home" ? "active-list" : "non-active-list"}
          onClick={() => setActiveMenu("home")}
        >
          Home
        </Link>
        <a
          href="#explore-menu"
          className={activeMenu === "menu" ? "active-list" : "non-active-list"}
          onClick={() => setActiveMenu("menu")}
        >
          Menu
        </a>
        <a
          href="#mobile-app"
          className={
            activeMenu === "mobileapp" ? "active-list" : "non-active-list"
          }
          onClick={() => setActiveMenu("mobileapp")}
        >
          Mobile app
        </a>
        <a
          href="#contact-us"
          className={
            activeMenu === "contactus" ? "active-list" : "non-active-list"
          }
          onClick={() => setActiveMenu("contactus")}
        >
          Contact us
        </a>
      </ul>
      <div className="navbar-search-cart-signin-container">
        <div className="cart-dot-container">
          <Link to="/cart">
            <img className="navbar-cart-icon" src={assets.basket_icon} alt="" />
          </Link>
          <div
            className={getSubTotalAmount() === 0 ? "" : "dot-container"}
          ></div>
        </div>
        {jwtToken === null ? (
          <button
            onClick={() => setShowLogin(true)}
            type="button"
            className="sign-in-button"
          >
            Sign in
          </button>
        ) : (
          <div className="navbar-profile-container">
            <img
              className="navbar-cart-icon"
              src={assets.profile_icon}
              alt=""
            />
            <ul className="navbar-user-profile-dorpdown">
              <li onClick={myordersHandler}>
                <img src={assets.bag_icon} alt="" />
                <p>Orders</p>
              </li>
              <hr />
              <li onClick={logoutHandler}>
                <img src={assets.logout_icon} alt="" />
                <p>Logout</p>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
