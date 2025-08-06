import React, { useContext } from "react";

import { StoreContext } from "../context/StoreContext";

import "./index.css";

const PlaceOrder = () => {
  const { getSubTotalAmount } = useContext(StoreContext);

  let deliveryFee = 0;
  if (getSubTotalAmount() < 30) {
    deliveryFee = Math.round(0.15 * getSubTotalAmount());
  } else if (getSubTotalAmount() >= 30 && getSubTotalAmount() < 100) {
    deliveryFee = Math.round(0.07 * getSubTotalAmount());
  } else {
    deliveryFee = 0;
  }

  return (
    <form className="place-order-main-form-container">
      <div className="place-order-left-container">
        <p className="delivery-title">Delivery Information</p>
        <div className="multi-input-fields-container">
          <input type="text" placeholder="First Name" />
          <input type="text" placeholder="Last Name" />
        </div>
        <input type="text" placeholder="Email address" />
        <input type="text" placeholder="Street" />
        <div className="multi-input-fields-container">
          <input type="text" placeholder="City" />
          <input type="text" placeholder="State" />
        </div>
        <div className="multi-input-fields-container">
          <input type="text" placeholder="Zip code" />
          <input type="text" placeholder="Country" />
        </div>
        <input type="text" placeholder="Phone" />
      </div>
      <div className="place-order-right-container">
        <div className="cart-total">
          <h2>Cart Totals</h2>
          <div>
            <div className="cart-total-details">
              <p>Subtotal</p>
              <p>$ {getSubTotalAmount()}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Delivery Fee</p>
              <p>$ {deliveryFee}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <b>Total</b>
              <b>$ {getSubTotalAmount() + deliveryFee}</b>
            </div>
          </div>
          <button type="button" className="checkout-button">
            Make payment
          </button>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;
