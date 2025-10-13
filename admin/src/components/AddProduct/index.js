import React, { useState } from "react";

import { assets } from "../../assets/admin_assets/assets";
import { toast } from "react-toastify";

import "./index.css";

const AddProduct = ({ apiUrl }) => {
  const [image, setImage] = useState(false);
  const [productData, setProductData] = useState({
    name: "",
    description: "",
    price: "",
    category: "Salad",
  });

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setProductData((prevData) => ({ ...prevData, [name]: value }));
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("name", productData.name);
    formData.append("description", productData.description);
    formData.append("price", Number(productData.price));
    formData.append("category", productData.category);
    formData.append("image", image);

    const url = `${apiUrl}/add-product`; //api to add item
    const options = {
      method: "POST",
      body: formData,
    };

    const response = await fetch(url, options);
    const data = await response.json();

    if (response.ok) {
      setProductData({
        name: "",
        description: "",
        price: "",
        category: "Salad",
      });
      setImage(false);
      toast.success(data.message);
    } else {
      toast.error(data.message);
    }
  };

  return (
    <div className="admin-add-product-main-container">
      <form
        onSubmit={onSubmitHandler}
        className="admin-add-product-form-container"
      >
        <div className="add-img-upload-container admin-add-product-form-container">
          <p>Upload Image</p>
          <label htmlFor="addimage">
            <img
              src={image ? URL.createObjectURL(image) : assets.upload_area}
              alt="addicon"
            />
          </label>
          <input
            onChange={(event) => setImage(event.target.files[0])}
            type="file"
            id="addimage"
            hidden
            required
          />
        </div>
        <div className="admin-add-product-name-container admin-add-product-form-container">
          <p>Product name</p>
          <input
            onChange={onChangeHandler}
            value={productData.name}
            type="text"
            name="name"
            placeholder="Type here"
          />
        </div>
        <div className="admin-add-product-description-container admin-add-product-form-container">
          <p>Product description</p>
          <textarea
            onChange={onChangeHandler}
            value={productData.description}
            name="description"
            rows="6"
            placeholder="Write content here"
            required
          ></textarea>
        </div>
        <div className="admin-add-category-price-container">
          <div className="add-category-container admin-add-product-form-container">
            <p>Product category</p>
            <select
              onChange={onChangeHandler}
              name="category"
              value={productData.category}
            >
              <option value="Salad">Salad</option>
              <option value="Rolls">Rolls</option>
              <option value="Deserts">Deserts</option>
              <option value="Sandwich">Sandwich</option>
              <option value="Cake">Cake</option>
              <option value="Pure Veg">Pure Veg</option>
              <option value="Pasta">Pasta</option>
              <option value="Noodles">Noodles</option>
            </select>
          </div>
          <div className="admin-add-price admin-add-product-form-container">
            <p>Product price</p>
            <input
              onChange={onChangeHandler}
              value={productData.price}
              type="Number"
              name="price"
              placeholder="₹7"
            />
          </div>
        </div>
        <button type="submit" className="add-product-button">
          Add product
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
