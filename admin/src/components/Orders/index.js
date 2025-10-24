import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { assets } from "../../assets/admin_assets/assets";
import { TailSpin } from "react-loader-spinner";

import "./index.css";

const Orders = ({ apiUrl }) => {
  const [ordersList, setOrdersList] = useState([]);
  const [showSpinner, setShowspinner] = useState(true);

  const getAllOrders = async () => {
    const url = `${apiUrl}/orderslist`; // api to get all orders list
    const options = {
      method: "GET",
    };

    const ordersResponse = await fetch(url, options);
    const ordersData = await ordersResponse.json();

    if (ordersResponse.ok) {
      setShowspinner(false);
      setOrdersList(ordersData);
    } else {
      toast.error("Error");
    }
  };

  useEffect(() => {
    getAllOrders();
  }, []);

  const statusHandler = async (event, orderId) => {
    const url = `${apiUrl}/update-status`; // api to update the order status
    const bodyData = { order_id: orderId, status: event.target.value };
    const options = {
      method: "PUT",
      body: JSON.stringify(bodyData),
      headers: {
        "Content-Type": "application/json",
      },
    };

    const response = await fetch(url, options);
    const resData = await response.json();

    if (response.ok) {
      await getAllOrders();
      toast.success(resData.message);
    } else {
      toast.error(resData.message);
    }
  };

  return (
    <div className="orders-list-main-container admin-add-product-main-container">
      <div className="orders-heading-and-refresh-container">
        <h3>Orders Page</h3>
        <button onClick={getAllOrders} type="button">
          Refresh orders
        </button>
      </div>
      {showSpinner ? (
        <TailSpin
          visible={true}
          height="50"
          width="50"
          color="tomato"
          ariaLabel="tail-spin-loading"
          radius="1"
          wrapperStyle={{
            marginTop: "50px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "50vh",
          }}
          wrapperClass=""
        />
      ) : (
        <div className="orders-list-container">
          {ordersList.map((each, index) => (
            <div key={index} className="order-item">
              <img src={assets.parcel_icon} alt="" />
              <div>
                <p className="order-item-food">
                  {each.items.map((item, index) => {
                    if (index === each.items.length - 1) {
                      return item.name + " x " + item.quantity;
                    } else {
                      return item.name + " x " + item.quantity + ", ";
                    }
                  })}
                </p>
                <p className="order-item-name">
                  {each.address.firstname} {each.address.lastname}
                </p>
                <div className="order-item-address">
                  <p>{each.address.street + ", "}</p>
                  <p>
                    {each.address.city +
                      ", " +
                      each.address.state +
                      ", " +
                      each.address.country +
                      ", " +
                      each.address.zipcode}
                  </p>
                </div>
                <p className="order-item-phone">{each.address.phone}</p>
              </div>
              <p>Items: {each.items.length}</p>
              <p>₹ {each.total_amount}</p>
              <select
                onChange={(event) => statusHandler(event, each.order_id)}
                value={each.status}
              >
                <option value="Food Processing">Food Processing</option>
                <option value="Out for delivery">Out for delivery</option>
                <option value="Delivered">Delivered</option>
              </select>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
