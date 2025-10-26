import React, { useContext, useEffect, useState } from "react";
import Cookies from "js-cookies";
import axios from "axios";
import { load } from "@cashfreepayments/cashfree-js";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { StoreContext } from "../context/StoreContext";

import "./index.css";

const PlaceOrder = () => {
  const {
    getSubTotalAmount,
    jwtToken,
    food_list,
    cartItems,
    setCartItems,
    apiUrl,
  } = useContext(StoreContext);

  const [loading, setLoading] = useState(false);
  const [orderData, setOrderData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    phone: "",
  });

  let cashfree;

  // Loads Cashfree SDK
  const initializeSDK = async () => {
    cashfree = await load({ mode: "sandbox" });
  };
  initializeSDK();

  const userData = Cookies.getItem("user_details");
  const parsedUserData = JSON.parse(userData);

  const navigate = useNavigate();

  let deliveryFee = 0;
  if (getSubTotalAmount() < 30) {
    deliveryFee = Math.round(0.15 * getSubTotalAmount());
  } else if (getSubTotalAmount() >= 30 && getSubTotalAmount() < 100) {
    deliveryFee = Math.round(0.07 * getSubTotalAmount());
  } else {
    deliveryFee = 0;
  }

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setOrderData((prevData) => ({ ...prevData, [name]: value }));
  };

  const cartFilteredFoodList = food_list
    .filter((item) => cartItems.hasOwnProperty(item._id))
    .map((item) => ({
      _id: item._id,
      name: item.name,
      price: item.price,
      quantity: cartItems[item._id],
    }));

  const makePaymentHandler = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);

      // creates order
      const orderRes = await axios.post(
        `${apiUrl}/payment`,
        {
          address: {
            firstname: orderData.firstName,
            lastname: orderData.lastName,
            email: orderData.email,
            street: orderData.street,
            city: orderData.city,
            state: orderData.state,
            zipcode: orderData.zipCode,
            country: orderData.country,
            phone: orderData.phone,
          },
          items: cartFilteredFoodList,
          amount: getSubTotalAmount() + deliveryFee,
          user_id: parsedUserData.userid,
          status: "Food Processing",
        },
        { headers: { Authorization: `Bearer ${jwtToken}` } }
      );

      if (!orderRes.data.payment_session_id) {
        alert("Failed to get payment session");
        setLoading(false);
        return;
      }

      const sessionId = orderRes.data.payment_session_id;

      // Cashfree Checkout
      let checkoutOptions = {
        paymentSessionId: sessionId,
        redirectTarget: "_modal",
      };

      const result = await cashfree.checkout(checkoutOptions);

      if (
        result.paymentDetails.paymentMessage ===
        "Payment finished. Check status."
      ) {
        const verifyResp = await axios.post(
          `${apiUrl}/orders/verify-payment`,
          {
            order_id: orderRes.data.order_id,
            user_id: parsedUserData.userid,
            address: {
              firstname: orderData.firstName,
              lastname: orderData.lastName,
              email: orderData.email,
              street: orderData.street,
              city: orderData.city,
              state: orderData.state,
              zipcode: orderData.zipCode,
              country: orderData.country,
              phone: orderData.phone,
              total_amount: getSubTotalAmount() + deliveryFee,
            },
            items: cartFilteredFoodList,
            amount: getSubTotalAmount() + deliveryFee,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${jwtToken}`,
            },
          }
        );

        if (verifyResp.data.ok) {
          setCartItems({});
          navigate("/myorders");
          toast.success(`Payment Successful`);
        } else {
          navigate("/");
          toast.error("Payment failed");
        }
      }

      setLoading(false);
    } catch (error) {
      console.error("Payment Error:", error);
      navigate("/");
      toast.error("Payment failed");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!jwtToken) {
      navigate("/cart");
    } else if (getSubTotalAmount() === 0) {
      navigate("/cart");
    }
  }, [jwtToken]);

  return (
    <form
      onSubmit={makePaymentHandler}
      className="place-order-main-form-container"
    >
      <div className="place-order-left-container">
        <p className="delivery-title">Delivery Information</p>
        <div className="multi-input-fields-container">
          <input
            type="text"
            placeholder="First Name"
            name="firstName"
            value={orderData.firstName}
            onChange={onChangeHandler}
            required
          />
          <input
            type="text"
            placeholder="Last Name"
            name="lastName"
            value={orderData.lastName}
            onChange={onChangeHandler}
            required
          />
        </div>
        <input
          type="email"
          placeholder="Email address"
          name="email"
          value={orderData.email}
          onChange={onChangeHandler}
          required
        />
        <input
          type="text"
          placeholder="Street"
          name="street"
          value={orderData.street}
          onChange={onChangeHandler}
          required
        />
        <div className="multi-input-fields-container">
          <input
            type="text"
            placeholder="City"
            name="city"
            value={orderData.city}
            onChange={onChangeHandler}
            required
          />
          <input
            type="text"
            placeholder="State"
            name="state"
            value={orderData.state}
            onChange={onChangeHandler}
            required
          />
        </div>
        <div className="multi-input-fields-container">
          <input
            type="text"
            placeholder="Zip code"
            name="zipCode"
            value={orderData.zipCode}
            onChange={onChangeHandler}
            required
            maxlength="6"
          />
          <input
            type="text"
            placeholder="Country"
            name="country"
            value={orderData.country}
            onChange={onChangeHandler}
            required
          />
        </div>
        <input
          type="text"
          placeholder="Phone"
          name="phone"
          value={orderData.phone}
          onChange={onChangeHandler}
          required
          maxlength="10"
        />
      </div>
      <div className="place-order-right-container">
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
          <button type="submit" className="checkout-button">
            {loading
              ? "Processing..."
              : `Pay ₹ ${getSubTotalAmount() + deliveryFee}`}
          </button>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;
