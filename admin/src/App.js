import React from "react";

import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import AddProduct from "./components/AddProduct";
import ListProducts from "./components/ListProducts";
import Orders from "./components/Orders";

import "./App.css";

const App = () => {
  return (
    <div>
      <Navbar />
      <hr />
      <ToastContainer />
      <div className="app-content">
        <Sidebar />
        <Routes>
          <Route exact path="/add-product" element={<AddProduct />} />
          <Route exact path="/list" element={<ListProducts />} />
          <Route exact path="/orders" element={<Orders />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
