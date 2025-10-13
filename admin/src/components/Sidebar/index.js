import React from "react";
import { NavLink } from "react-router-dom";

import { assets } from "../../assets/admin_assets/assets";

import "./index.css";

const Sidebar = () => {
  return (
    <div className="admin-side-navbar-container">
      <div className="admin-sidebar-options-container">
        <NavLink to="/add-product" className="admin-sidebar-option">
          <img src={assets.add_icon} alt="addicon" />
          <p>Add Items</p>
        </NavLink>
        <NavLink to="/list" className="admin-sidebar-option">
          <img src={assets.order_icon} alt="addicon" />
          <p>List Items</p>
        </NavLink>
        <NavLink to="/orders" className="admin-sidebar-option">
          <img src={assets.order_icon} alt="addicon" />
          <p>Orders</p>
        </NavLink>
      </div>
    </div>
  );
};

export default Sidebar;
