import React from "react";

import { assets } from "../../assets/admin_assets/assets";

import "./index.css";

const Navbar = () => {
  return (
    <div className="admin-navbar-container">
      <img className="admin-logo" src={assets.logo} alt="logo" />
      <img className="admin-profile" src={assets.profile_image} alt="profile" />
    </div>
  );
};

export default Navbar;
