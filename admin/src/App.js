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
  const apiUrl = "http://localhost:4000";

  return (
    <div>
      <ToastContainer
        position="bottom-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick={true}
        limit={3}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <Navbar />
      <hr />
      <div className="app-content">
        <Sidebar />
        <Routes>
          <Route
            exact
            path="/add-product"
            element={<AddProduct apiUrl={apiUrl} />}
          />
          <Route
            exact
            path="/list"
            element={<ListProducts apiUrl={apiUrl} />}
          />
          <Route exact path="/orders" element={<Orders apiUrl={apiUrl} />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
