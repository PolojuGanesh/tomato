import React, { useContext } from "react";
import { StoreContext } from "../context/StoreContext";
import FoodItems from "../FoodItems";

import "./index.css";

const FoodDisplay = ({ menuCategory }) => {
  const { food_list } = useContext(StoreContext);

  return (
    <div className="food-display-container">
      <h2 className="food-display-main-heading">Top dishes near you</h2>
      <div className="food-items-list-container">
        {food_list.map((eachFoodItem) => {
          if (
            menuCategory === "allCategories" ||
            menuCategory === eachFoodItem.category
          ) {
            return (
              <FoodItems key={eachFoodItem._id} eachFoodItem={eachFoodItem} />
            );
          }
        })}
      </div>
    </div>
  );
};

export default FoodDisplay;
