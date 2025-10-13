import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Cart from "./components/Cart";
import PlaceOrder from "./components/PlaceOrder";
import Footer from "./components/Footer";
import { useState } from "react";
import Login from "./components/Login";
import MyOrders from "./components/MyOrders";

import "./App.css";

const App = () => {
  const [showLogin, setShowLogin] = useState(false);

  return (
    <>
      <div className="app">
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
        {showLogin ? <Login setShowLogin={setShowLogin} /> : <></>}
        <Navbar setShowLogin={setShowLogin} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/order" element={<PlaceOrder />} />
          <Route path="/myorders" element={<MyOrders />} />
        </Routes>
      </div>
      <Footer />
    </>
  );
};

export default App;
