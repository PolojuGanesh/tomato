import React, { useContext, useEffect, useState } from "react";
import { StoreContext } from "../context/StoreContext";
import Cookies from "js-cookies";

import { assets } from "../../assets/frontend_assets/assets";

import "./index.css";

const MyOrders = () => {
  const { jwtToken, apiUrl } = useContext(StoreContext);
  const [myOrdersList, setMyOrders] = useState([]);

  const userData = Cookies.getItem("user_details");
  const parsedUserData = JSON.parse(userData);

  const getMyOrders = async () => {
    const url = `${apiUrl}/myorders`;
    const options = {
      method: "POST",
      body: JSON.stringify({ user_id: parsedUserData.userid }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwtToken}`,
      },
    };

    const myOrdersResponse = await fetch(url, options);
    const responseData = await myOrdersResponse.json();

    if (myOrdersResponse.ok) {
      setMyOrders(responseData);
    }
  };

  useEffect(() => {
    if (jwtToken) {
      getMyOrders();
    }
  }, [jwtToken]);

  return (
    <div className="my-orders-main-container">
      <h2>My Orders</h2>
      <div className="each-item-container">
        {myOrdersList.map((each, index) => {
          return (
            <div key={index} className="item-container">
              <img src={assets.parcel_icon} alt="" />
              <p>
                {each.items.map((item, index) => {
                  if (index === each.items.length - 1) {
                    return item.name + " x " + item.quantity;
                  } else {
                    return item.name + " x " + item.quantity + ", ";
                  }
                })}
              </p>
              <p>₹ {each.total_amount}</p>
              <p>Items: {each.items.length}</p>
              <p>
                <span>&#x25cf;</span> <b>{each.status}</b>
              </p>
              <button type="button" onClick={getMyOrders}>
                Track Order
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MyOrders;
