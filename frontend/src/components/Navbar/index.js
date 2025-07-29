import { useContext, useState } from "react";
import { Link } from "react-router-dom";

import { assets } from "../../assets/frontend_assets/assets";
import { StoreContext } from "../context/StoreContext";

import "./index.css";

const Navbar = (props) => {
  const [activeMenu, setActiveMenu] = useState("home");
  const { getSubTotalAmount } = useContext(StoreContext);

  const { setShowLogin } = props;

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
        <img className="navbar-serach-icon" src={assets.search_icon} alt="" />
        <div className="cart-dot-container">
          <Link to="/cart">
            <img className="navbar-cart-icon" src={assets.basket_icon} alt="" />
          </Link>
          <div
            className={getSubTotalAmount() === 0 ? "" : "dot-container"}
          ></div>
        </div>
        <button
          onClick={() => setShowLogin(true)}
          type="button"
          className="sign-in-button"
        >
          Sign in
        </button>
      </div>
    </div>
  );
};

export default Navbar;
