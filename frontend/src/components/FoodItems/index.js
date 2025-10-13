import { useContext } from "react";
import { assets } from "../../assets/frontend_assets/assets";
import { StoreContext } from "../context/StoreContext";

import "./index.css";

const FoodItems = (props) => {
  const { addToCart, removeFromCart, cartItems, apiUrl } =
    useContext(StoreContext);

  const { eachFoodItem } = props;
  const { _id, name, price, description, image } = eachFoodItem;

  return (
    <div className="each-food-item-container">
      <div className="food-item-image-container">
        <img
          className="food-item-image"
          src={`${apiUrl}/images/${image}`}
          alt={name}
        />
        {!cartItems[_id] ? (
          <img
            onClick={() => addToCart(_id, eachFoodItem)}
            className="add-item-img"
            src={assets.add_icon_white}
            alt=""
          />
        ) : (
          <div className="item-quantity-controller-container">
            <img
              className="quantity-control-img"
              alt=""
              src={assets.remove_icon_red}
              onClick={() => removeFromCart(_id, eachFoodItem)}
            />
            <p className="quantity-count-para">{cartItems[_id]}</p>
            <img
              className="quantity-control-img"
              alt=""
              src={assets.add_icon_green}
              onClick={() => addToCart(_id, eachFoodItem)}
            />
          </div>
        )}
      </div>
      <div className="food-item-info-container">
        <div className="food-item-name-and-rating-container">
          <p className="food-item-name">{name}</p>
          <img
            className="food-item-rating"
            src={assets.rating_starts}
            alt="rating"
          />
        </div>
        <p className="food-item-description">{description}</p>
        <p className="food-item-price">₹ {price}</p>
      </div>
    </div>
  );
};

export default FoodItems;
