import React, { useState } from "react";

import ExploreMenu from "../ExploreMenu";
import FoodDisplay from "../FoodDisplay";
import { assets } from "../../assets/frontend_assets/assets";

import "./index.css";

const Home = () => {
  const [menuCategory, setMenuCategory] = useState("allCategories");

  return (
    <>
      <div className="home-main-container">
        <div className="home-banner-container">
          <h2 className="home-banner-main-heading">
            Order your favourite food hereYour Favorite Food, Just a Tap Away
          </h2>
          <p className="home-banner-para">
            Hungry? Discover a world of flavors with our easy-to-use app. From
            local favorites to international delights, get the meals you love
            delivered straight to you—fast, fresh, and exactly how you want it.
          </p>
          <button type="button" className="home-view-menu-button">
            View Menu
          </button>
        </div>
      </div>
      <ExploreMenu
        menuCategory={menuCategory}
        setMenuCategory={setMenuCategory}
      />
      <hr className="home-horizontal-line" />
      <FoodDisplay menuCategory={menuCategory} />
      <div className="app-download-container" id="mobile-app">
        <p className="app-download-para">
          For Better Experience Download <br /> Tomato App
        </p>
        <div className="app-download-platforms-container">
          <img src={assets.play_store} alt="" className="app-download-img" />
          <img src={assets.app_store} alt="" className="app-download-img" />
        </div>
      </div>
    </>
  );
};

export default Home;
