import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { TailSpin } from "react-loader-spinner";

import "./index.css";

const ListProducts = ({ apiUrl }) => {
  const [productsList, setProductsList] = useState([]);
  const [showSpinner, setShowspinner] = useState(true);

  const fetchProductsList = async () => {
    const url = `${apiUrl}/added-products-list`; // api to get all item list
    const options = {
      method: "GET",
    };

    const response = await fetch(url, options);
    const responseData = await response.json();

    if (response.ok) {
      setShowspinner(false);
      setProductsList(responseData);
    } else {
      //show error toast message
    }
  };

  const removeFood = async (foodId, foodName) => {
    const url = `${apiUrl}/remove-product/${foodId}`; // api to remove added item from food list
    const options = {
      method: "DELETE",
    };

    const response = await fetch(url, options);
    const data = await response.json();
    await fetchProductsList();

    if (response.ok) {
      toast.success(`${foodName} ${data.message}`);
    } else {
      toast.error(data.message);
    }
  };

  useEffect(() => {
    fetchProductsList();
  }, []);

  return (
    <div className="list admin-add-product-main-container admin-add-product-form-container">
      <p>All Foods List</p>
      <div className="products-list-table">
        <div className="list-table-format title">
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b>Action</b>
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
          productsList.map((eachProduct) => {
            return (
              <div key={eachProduct._id} className="list-table-format">
                <img src={`${apiUrl}/images/` + eachProduct.image} alt="" />
                <p>{eachProduct.name}</p>
                <p>{eachProduct.category}</p>
                <p>₹ {eachProduct.price}</p>
                <p
                  onClick={() => removeFood(eachProduct._id, eachProduct.name)}
                  className="cursor"
                >
                  X
                </p>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ListProducts;
