import { createContext, useEffect, useState } from "react";
import Cookies from "js-cookies";
import { toast } from "react-toastify";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  const [cartItems, setCartItems] = useState({});
  const [food_list, setFoodList] = useState([]);
  const [jwtToken, setJwtToken] = useState(Cookies.getItem("jwt_token"));
  const [userSearch, setUserSearch] = useState("");

  const userData = Cookies.getItem("user_details");
  const parsedUserData = JSON.parse(userData);

  const apiUrl = "https://tomato-backend-foew.onrender.com";

  const getFoodListHandler = async () => {
    let url;
    if (userSearch === "") {
      url = `${apiUrl}/items`; // api to get all items
    } else {
      url = `${apiUrl}/items?search=${userSearch}`; // api to get only searched items dynamically
    }
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

  const addToCart = async (itemId, foodItem) => {
    const quantity = cartItems[itemId] ? cartItems[itemId] + 1 : 1;
    const price = foodItem.price;

    // Updates cart state
    setCartItems((prev) => ({ ...prev, [itemId]: quantity }));

    if (jwtToken) {
      const itemDetails = {
        user_id: parsedUserData.userid,
        product_id: itemId,
        quantity,
        price,
      };

      const url = `${apiUrl}/addtocart`; // api to add item to cart
      const options = {
        method: "POST",
        body: JSON.stringify(itemDetails),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`,
        },
      };

      const response = await fetch(url, options);
      const addToCartResponse = await response.json();
      if (response.ok) {
        toast.success(`${foodItem.name} ${addToCartResponse.message}`);
      } else {
        toast.error(addToCartResponse.message);
      }
    }
  };

  const removeFromCart = async (itemId, foodItem) => {
    const quantity = cartItems[itemId] ? cartItems[itemId] - 1 : 0;

    // Updates cart state
    setCartItems((prev) => ({ ...prev, [itemId]: quantity }));

    if (jwtToken) {
      const itemDetails = {
        user_id: parsedUserData.userid,
        product_id: itemId,
      };

      console.log(itemDetails);
      const url = `${apiUrl}/removecartitem`; // api to remove item from cart
      const options = {
        method: "PUT",
        body: JSON.stringify(itemDetails),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`,
        },
      };

      const response = await fetch(url, options);
      const removeFromCartResponse = await response.json();
      if (response.ok) {
        toast.success(`${foodItem.name} ${removeFromCartResponse.message}`);
      } else {
        toast.error(removeFromCartResponse.message);
      }
    }
  };

  const getSubTotalAmount = () => {
    let totalAmount = 0;

    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        const itemInfo = food_list.find(
          (eachItem) => eachItem._id === parseInt(item)
        );
        totalAmount += itemInfo.price * cartItems[item];
      }
    }

    return totalAmount;
  };

  const loadUserCartItems = async () => {
    const url = `${apiUrl}/cartitems/${parsedUserData.userid}`; // api to load cart items of specific user
    const options = {
      method: "GET",
      headers: { Authorization: `Bearer ${jwtToken}` },
    };

    const userCartItemsResponse = await fetch(url, options);
    const userCartItemsData = await userCartItemsResponse.json();

    if (userCartItemsResponse.ok) {
      // Converts array of objects into { product_id: quantity }
      const normalizedCart = {};
      userCartItemsData.forEach((item) => {
        normalizedCart[item.product_id] = item.quantity;
      });

      setCartItems(normalizedCart);
    }
  };

  useEffect(() => {
    getFoodListHandler();
    if (jwtToken) {
      loadUserCartItems();
    }
    // eslint-disable-next-line
  }, [jwtToken, userData]);

  useEffect(() => {
    getFoodListHandler();
    // eslint-disable-next-line
  }, [userSearch]);

  const contextValue = {
    food_list,
    cartItems,
    setCartItems,
    addToCart,
    removeFromCart,
    getSubTotalAmount,
    jwtToken,
    setJwtToken,
    userSearch,
    setUserSearch,
    apiUrl,
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
