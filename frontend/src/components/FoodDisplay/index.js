import React, { useContext } from "react";
import { StoreContext } from "../context/StoreContext";
import FoodItems from "../FoodItems";
import { assets } from "../../assets/frontend_assets/assets";
import { TailSpin } from "react-loader-spinner";

import "./index.css";

const FoodDisplay = ({ menuCategory }) => {
  const { food_list, userSearch, setUserSearch, showSpinner } =
    useContext(StoreContext);

  return (
    <div className="food-display-container">
      <div className="heading-and-search-container">
        <h2 className="food-display-main-heading">Top dishes near you</h2>
        <div className="item-search-input-container">
          <input
            value={userSearch}
            onChange={(event) => setUserSearch(event.target.value)}
            type="text"
            placeholder="Search menu items..."
          />
          <img src={assets.search_icon} alt="" />
        </div>
      </div>
      <div className="food-items-list-container">
        {showSpinner ? (
          <div className="spinner-container">
            <TailSpin
              visible={true}
              height="50"
              width="50"
              color="tomato"
              ariaLabel="tail-spin-loading"
              radius="1"
              wrapperStyle={{}}
              wrapperClass=""
            />
          </div>
        ) : (
          food_list.map((eachFoodItem) => {
            if (
              menuCategory === "allCategories" ||
              menuCategory === eachFoodItem.category
            ) {
              return (
                <FoodItems key={eachFoodItem._id} eachFoodItem={eachFoodItem} />
              );
            }
          })
        )}
      </div>
    </div>
  );
};

export default FoodDisplay;
