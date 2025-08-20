import { createContext, useEffect, useState } from "react";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  const [cartItems, setCartItems] = useState({});
  const [food_list, setFoodList] = useState([]);

  const getFoodListHandler = async () => {
    const url = "http://localhost:4000/added-products-list";
    const options = {
      method: "GET",
    };

    const response = await fetch(url, options);
    const responseData = await response.json();

    if (response.ok) {
      setFoodList(responseData);
    } else {
    }
  };

  useEffect(() => {
    getFoodListHandler();
    // eslint-disable-next-line
  }, []);

  const addToCart = (itemId) => {
    console.log(itemId);
    if (cartItems[itemId]) {
      setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
    } else {
      setCartItems((prev) => ({ ...prev, [itemId]: 1 }));
    }
  };

  const removeFromCart = (itemId) => {
    setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }));
  };

  const getSubTotalAmount = () => {
    let totalAmount = 0;

    for (const item in cartItems) {
      console.log(item);
      if (cartItems[item] > 0) {
        const itemInfo = food_list.find(
          (eachItem) => eachItem._id === parseInt(item)
        );
        console.log(itemInfo);
        totalAmount += itemInfo.price * cartItems[item];
      }
    }

    return totalAmount;
  };

  const contextValue = {
    food_list,
    cartItems,
    setCartItems,
    addToCart,
    removeFromCart,
    getSubTotalAmount,
  };

  console.log(cartItems);
  console.log(food_list);

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
