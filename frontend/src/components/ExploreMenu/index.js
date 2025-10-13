import React from "react";
import { menu_list } from "../../assets/frontend_assets/assets";

import "./index.css";

const ExploreMenu = ({ menuCategory, setMenuCategory }) => {
  return (
    <div className="explore-menu-main-container" id="explore-menu">
      <h1 className="explore-menu-main-heading">Explore Menu</h1>
      <p className="explore-menu-para">
        Dive into a world of delicious possibilities! From mouth-watering
        starters to irresistible desserts, our menu has something for every
        craving.
      </p>
      <div className="explore-menu-list">
        {menu_list.map((eachMenuItem) => {
          return (
            <div
              onClick={() =>
                setMenuCategory((prev) =>
                  prev === eachMenuItem.menu_name
                    ? "allCategories"
                    : eachMenuItem.menu_name
                )
              }
              value={menuCategory}
              key={eachMenuItem.menu_name}
              className="explore-menu-each-item"
            >
              <img
                src={eachMenuItem.menu_image}
                alt={eachMenuItem.menu_name}
                className={
                  menuCategory === eachMenuItem.menu_name
                    ? "active"
                    : "each-menu-item-image"
                }
              />
              <p className="menu-name">{eachMenuItem.menu_name}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ExploreMenu;
