import React, { useEffect, useState } from "react";

import "./index.css";
import { toast } from "react-toastify";

const ListProducts = () => {
  const [productsList, setProductsList] = useState([]);

  const fetchProductsList = async () => {
    const url = "http://localhost:4000/added-products-list";
    const options = {
      method: "GET",
    };

    const response = await fetch(url, options);
    const responseData = await response.json();

    if (response.ok) {
      console.log(responseData);
      setProductsList(responseData);
    } else {
      //show error toast message
    }
  };

  const removeFood = async (foodId) => {
    //make api call to delete the product
    // 5hr:47min video
    const url = `http://localhost:4000/remove-product/${foodId}`;
    const options = {
      method: "DELETE",
    };

    const response = await fetch(url, options);
    const data = await response.json();
    await fetchProductsList();

    if (response.ok) {
      toast.success(data.message);
    } else {
      //toast.error(data.message)
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
        {productsList.map((eachProduct) => {
          return (
            <div key={eachProduct._id} className="list-table-format">
              <img
                src={`${"http://localhost:4000/images/"}` + eachProduct.image}
                alt=""
              />
              <p>{eachProduct.name}</p>
              <p>{eachProduct.category}</p>
              <p>$ {eachProduct.price}</p>
              <p onClick={() => removeFood(eachProduct._id)} className="cursor">
                X
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ListProducts;
