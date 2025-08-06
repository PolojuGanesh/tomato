import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Cart from "./components/Cart";
import PlaceOrder from "./components/PlaceOrder";
import Footer from "./components/Footer";
import { useState } from "react";
import Login from "./components/Login";

import "./App.css";

const App = () => {
  const [showLogin, setShowLogin] = useState(false);

  return (
    <>
      <div className="app">
        <ToastContainer />
        {showLogin ? <Login setShowLogin={setShowLogin} /> : <></>}
        <Navbar setShowLogin={setShowLogin} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/order" element={<PlaceOrder />} />
        </Routes>
      </div>
      <Footer />
    </>
  );
};

export default App;
