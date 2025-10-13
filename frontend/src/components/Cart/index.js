import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";

import { StoreContext } from "../context/StoreContext";

import "./index.css";

const Cart = () => {
  const { food_list, cartItems, removeFromCart, getSubTotalAmount, apiUrl } =
    useContext(StoreContext);

  const navigate = useNavigate();

  let deliveryFee = 0;
  if (getSubTotalAmount() < 30) {
    deliveryFee = Math.round(0.15 * getSubTotalAmount());
  } else if (getSubTotalAmount() >= 30 && getSubTotalAmount() < 100) {
    deliveryFee = Math.round(0.07 * getSubTotalAmount());
  } else {
    deliveryFee = 0;
  }

  return (
    <div className="cart-main-container">
      <div className="cart-items-container">
        <div className="cart-items-title-container">
          <p>Items</p>
          <p>Title</p>
          <p>Price</p>
          <p>Quantity</p>
          <p>Total</p>
          <p>Remove</p>
        </div>
        <br />
        <hr />
        {food_list.map((eachItem) => {
          if (cartItems[eachItem._id]) {
            return (
              <div key={eachItem._id}>
                <div className="each-cart-item-container cart-items-title-container">
                  <img src={`${apiUrl}/images/${eachItem.image}`} alt="" />
                  <p>{eachItem.name}</p>
                  <p>₹ {eachItem.price}</p>
                  <p>{cartItems[eachItem._id]}</p>
                  <p>₹ {eachItem.price * cartItems[eachItem._id]}</p>
                  <p
                    onClick={() => removeFromCart(eachItem._id)}
                    className="cross-mark-in-cart"
                  >
                    x
                  </p>
                </div>
                <hr />
              </div>
            );
          }
        })}
      </div>
      <div className="checkout-container">
        <div className="cart-total">
          <h2>Cart Totals</h2>
          <div>
            <div className="cart-total-details">
              <p>Subtotal</p>
              <p>₹ {getSubTotalAmount()}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Delivery Fee</p>
              <p>₹ {deliveryFee}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <b>Total</b>
              <b>₹ {getSubTotalAmount() + deliveryFee}</b>
            </div>
          </div>
          <button
            onClick={() => navigate("/order")}
            type="button"
            className="checkout-button"
          >
            Checkout
          </button>
        </div>
        <div className="cart-promocode">
          <div>
            <p>If you have a promo code, Enter it here.</p>
            <div className="cart-promocode-input">
              <input type="text" placeholder="Enter promocode" />
              <button type="button">Submit</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
