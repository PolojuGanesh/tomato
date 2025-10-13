const express = require("express");
const cors = require("cors");
const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const multer = require("multer");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Cashfree } = require("cashfree-pg");
const axios = require("axios");

require("dotenv").config();

// app config
const app = express();
const port = 4000;

// middleware
app.use(cors());
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

const dbPath = path.join(__dirname, "database.db");

let db = null;

const initializeDatabaseAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(port, () => {
      console.log(`Server running at http://localhost:${port}`);
    });
  } catch (error) {
    console.log(`Error message ${error.message}`);
    process.exit(1);
  }
};

initializeDatabaseAndServer();

// auth middleware
const authMiddleware = async (request, response, next) => {
  let jwtToken;
  const token = request.headers["authorization"];
  if (token !== undefined) {
    jwtToken = token.split(" ")[1];
  }
  if (jwtToken === undefined) {
    response.status(401);
    response.send({ message: "Not authorized login again" });
  } else {
    jwt.verify(jwtToken, "My_Token", async (error, payload) => {
      if (error) {
        response.status(401);
        response.send({ message: "Not authorized login again" });
      } else {
        // request.username = payload.username;
        next();
      }
    });
  }
};

// image storage (diskstorage configuration)
const storage = multer.diskStorage({
  destination: "uploads",
  filename: (req, file, cb) => {
    return cb(null, `${Date.now()}${file.originalname}`);
  },
});
const upload = multer({ storage: storage });

//to access the image (admin)
app.use("/images", express.static("uploads"));

// Sandbox or Production URL
const CASHFREE_API =
  process.env.CASHFREE_API_URL || "https://sandbox.cashfree.com/pg";

// API keys
const APP_ID = process.env.CASHFREE_APP_ID; // Sandbox Client ID
const SECRET_KEY = process.env.CASHFREE_SECRET_KEY; // Sandbox Client Secret

if (!APP_ID || !SECRET_KEY) {
  console.warn("CASHFREE_APP_ID or CASHFREE_SECRET_KEY missing in .env");
}

//add product api (admin)
app.post("/add-product", upload.single("image"), async (request, response) => {
  let image = `${request.file.filename}`;
  const productData = {
    image: image,
    name: request.body.name,
    description: request.body.description,
    category: request.body.category,
    price: request.body.price,
  };
  const addProductQuery = `
  INSERT INTO products 
  (image, name, description, category, price)
  VALUES 
  (?, ?, ?, ?, ?);`;
  await db.run(addProductQuery, [
    productData.image,
    productData.name,
    productData.description,
    productData.category,
    productData.price,
  ]);
  response.send({ message: `${request.body.name} added successfully!` });
});

//get added products list api (admin)
app.get("/added-products-list", async (request, response) => {
  const getAddedProductsList = `
  SELECT * FROM products;`;
  const dbResponse = await db.all(getAddedProductsList);
  response.send(dbResponse);
});

//delete product api (admin)
app.delete("/remove-product/:_id", async (request, response) => {
  const { _id } = request.params;
  const productDeleteQuery = `DELETE FROM products
  WHERE _id = ${_id};`;
  await db.run(productDeleteQuery);
  response.send({ message: "deleted successfully!" });
});

//user register api (frontend)
app.post("/register", async (request, response) => {
  const { username, password, email } = request.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const checkUserQuery = `SELECT * FROM users WHERE email = '${email}'`;
  const dbUser = await db.get(checkUserQuery);

  if (dbUser === undefined) {
    const userCreateQuery = `
    INSERT INTO USERS 
    (username, password, email)
    VALUES 
    (
      '${username}',
      '${hashedPassword}',
      '${email}'
    );`;
    await db.run(userCreateQuery);
    const payload = { email: email };
    const jwtToken = jwt.sign(payload, "My_Token");
    const lastIdQuery = `SELECT * FROM users WHERE email = '${email}'`;
    const getuserDetailsLastId = await db.get(lastIdQuery);
    response.send({
      jwtToken: jwtToken,
      message: "Registered successfully!",
      userDetails: {
        userid: `${getuserDetailsLastId.id}`,
        username: `${getuserDetailsLastId.username}`,
        email: `${getuserDetailsLastId.email}`,
      },
    });
  } else {
    response.status(400);
    response.send({ message: "User already exists!" });
  }
});

//user login api (frontend)
app.post("/login", async (request, response) => {
  const { email, password } = request.body;
  const checkUserQuery = `SELECT * FROM users WHERE email = '${email}';`;
  const dbUser = await db.get(checkUserQuery);

  if (dbUser === undefined) {
    response.status(400);
    response.send({ message: "Invalid User" });
  } else {
    const isPasswordMatched = await bcrypt.compare(password, dbUser.password);
    if (isPasswordMatched) {
      const payload = { email: email };
      const jwtToken = jwt.sign(payload, "My_Token");
      response.send({
        jwtToken: jwtToken,
        message: "Login successfull!",
        userDetails: {
          userid: `${dbUser.id}`,
          username: `${dbUser.username}`,
          email: `${dbUser.email}`,
        },
      });
    } else {
      response.status(400);
      response.send({ message: "Invalid password!" });
    }
  }
});

// products list api (frontend)
app.get("/items", async (request, response) => {
  const { search } = request.query;
  let getFoodItemsQuery;
  let params = [];
  if (search) {
    getFoodItemsQuery = `SELECT * FROM products WHERE name LIKE ?;`;
    params = [`%${search}%`];
  } else {
    getFoodItemsQuery = `SELECT * FROM products;`;
  }
  const itemsQueryResponse = await db.all(getFoodItemsQuery, params);
  response.send(itemsQueryResponse);
});

//add to cart api (frontend)
app.post("/addtocart", authMiddleware, async (request, response) => {
  const { user_id, product_id, quantity, price } = request.body;

  try {
    // Check if product already exists in the user's cart
    const getProductQuery = `
      SELECT * FROM cart WHERE user_id = ? AND product_id = ?;
    `;
    const getProductPresented = await db.get(getProductQuery, [
      user_id,
      product_id,
    ]);

    if (!getProductPresented) {
      // Insert new product into cart
      const queryForProductInsert = `
        INSERT INTO cart (user_id, product_id, quantity, price) 
        VALUES (?, ?, ?, ?);
      `;
      await db.run(queryForProductInsert, [
        user_id,
        product_id,
        quantity,
        price,
      ]);
    } else {
      // Update existing product's quantity and price
      const newQuantity = getProductPresented.quantity + 1;
      const newPrice = price * newQuantity; // unit price × total quantity

      const updateQuery = `
        UPDATE cart 
        SET quantity = ?, price = ?
        WHERE user_id = ? AND product_id = ?;
      `;
      await db.run(updateQuery, [newQuantity, newPrice, user_id, product_id]);
    }

    response.send({ message: "added to cart" });
  } catch (error) {
    console.error("Error adding to cart:", error);
    response.status(500);
    response.send({ message: "Failed to add item to cart" });
  }
});

// remove from cart api (frontend)
app.put("/removecartitem", authMiddleware, async (request, response) => {
  const { user_id, product_id } = request.body;

  try {
    const getProductQuery = `
      SELECT * FROM cart WHERE user_id = ? AND product_id = ?;
    `;
    const product = await db.get(getProductQuery, [user_id, product_id]);

    if (!product) {
      return response.status(404).send({ message: "not found in cart" });
    }

    if (product.quantity > 1) {
      const newQuantity = product.quantity - 1;
      const newPrice = (product.price / product.quantity) * newQuantity;
      // keeps unit price consistent

      const updateQuery = `
        UPDATE cart 
        SET quantity = ?, price = ?
        WHERE user_id = ? AND product_id = ?;
      `;
      await db.run(updateQuery, [newQuantity, newPrice, user_id, product_id]);
      response.send({ message: "quantity decreased" });
    } else {
      // If only 1 left, remove the item
      const deleteQuery = `
        DELETE FROM cart WHERE user_id = ? AND product_id = ?;
      `;
      await db.run(deleteQuery, [user_id, product_id]);
      response.send({ message: "removed from cart" });
    }
  } catch (error) {
    console.error("Error updating cart:", error);
    response.status(500).send("Internal Server Error");
    response.send({ message: "Failed to remove item from cart" });
  }
});

// get cart items api (frontend)
app.get("/cartitems/:user_id", authMiddleware, async (request, response) => {
  const { user_id } = request.params;

  try {
    const userCartItemsQuery = `
      SELECT * FROM cart INNER JOIN products ON cart.product_id = products._id WHERE user_id = ?;
    `;
    const responseData = await db.all(userCartItemsQuery, [user_id]);
    response.send(responseData);
  } catch (error) {
    console.error("Error fetching cart items:", error);
    response.status(500);
  }
});

// placeOrder api (frontend)
app.post("/payment", authMiddleware, async (request, response) => {
  try {
    const { address, items, amount, user_id, status } = request.body;

    const {
      firstname,
      lastname,
      email,
      street,
      city,
      state,
      zipcode,
      country,
      phone,
    } = address;

    const payload = {
      order_amount: amount,
      order_currency: "INR",
      customer_details: {
        customer_id: String(user_id) || "cus_" + Date.now(),
        customer_email: email,
        customer_phone: phone,
        customer_name: `${firstname} ${lastname}`,
      },
      order_meta: {
        return_url: process.env.RETURN_URL || "http://localhost:3000/myorders",
      },
    };

    const resp = await axios.post(`${CASHFREE_API}/orders`, payload, {
      headers: {
        "Content-Type": "application/json",
        "x-client-id": APP_ID,
        "x-client-secret": SECRET_KEY,
        "x-api-version": "2023-08-01",
      },
    });

    return response.json(resp.data);
  } catch (err) {
    console.error("create-order error:", err.response?.data || err.message);
    return response.status(500).json({
      error: "create_order_failed",
      details: err.response?.data || err.message,
    });
  }
});

// verify payment api (frontend)
app.post(
  "/orders/verify-payment",
  authMiddleware,
  async (request, response) => {
    const { order_id, user_id, address, items, amount } = request.body;

    if (!order_id)
      return response.status(400).json({ error: "order_id required" });

    try {
      const cfResp = await axios.get(`${CASHFREE_API}/orders/${order_id}`, {
        headers: {
          "Content-Type": "application/json",
          "x-client-id": APP_ID,
          "x-client-secret": SECRET_KEY,
          "x-api-version": "2023-08-01",
        },
      });

      const order_status = cfResp.data.order_status || cfResp.data.status;

      if (order_status === "PAID") {
        db.run(
          `INSERT INTO addresses (
          order_id, user_id, firstname, lastname, email, street, city, state, zipcode, country, phone, status, total_amount
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            order_id,
            user_id,
            address.firstname,
            address.lastname,
            address.email,
            address.street,
            address.city,
            address.state,
            address.zipcode,
            address.country,
            address.phone,
            "Food Processing",
            amount,
          ]
        );

        for (const item of items) {
          await db.run(
            `INSERT INTO order_items (order_id, product_id, name, price, quantity, image)
           VALUES (?, ?, ?, ?, ?, ?)`,
            [
              order_id,
              item._id,
              item.name,
              item.price,
              item.quantity,
              item.image,
            ]
          );
        }

        await db.run(`DELETE FROM cart WHERE user_id = ?`, [user_id]);

        return response.json({
          ok: true,
          message: "Payment successful! Order placed.",
        });
      } else {
        return response.json({
          ok: false,
          message: "Payment not successful. Order not placed.",
        });
      }
    } catch (err) {
      console.error(err.response?.data || err.message);
      response.status(500).json({ error: "failed_to_verify" });
    }
  }
);

app.post("/myorders", authMiddleware, async (request, response) => {
  try {
    const { user_id } = request.body;

    const myOrdersQuery = `
    SELECT *
    FROM addresses
    LEFT JOIN order_items ON addresses.order_id = order_items.order_id
    WHERE addresses.user_id = ?
    ORDER BY addresses.ordered_date DESC;`;

    const myOrdersResponse = await db.all(myOrdersQuery, [user_id]);

    // Group by order_id
    const ordersMap = {};

    myOrdersResponse.forEach((order) => {
      const {
        order_id,
        total_amount,
        ordered_date,
        updated_date,
        status,
        user_id,
        firstname,
        lastname,
        email,
        street,
        city,
        state,
        zipcode,
        country,
        phone,
        name,
        quantity,
        price,
        image,
        category,
      } = order;

      if (!ordersMap[order_id]) {
        ordersMap[order_id] = {
          order_id,
          address: {
            firstname,
            lastname,
            email,
            street,
            city,
            state,
            zipcode,
            country,
            phone,
          },
          total_amount,
          ordered_date,
          updated_date,
          status,
          user_id,
          items: [],
        };
      }

      ordersMap[order_id].items.push({
        name,
        category,
        image,
        quantity,
        price,
      });
    });

    // Convert map to array and ensure latest order appears first
    const finalOrders = Object.values(ordersMap).sort(
      (a, b) => new Date(b.ordered_date) - new Date(a.ordered_date)
    );

    return response.json(finalOrders);
  } catch (error) {
    console.error(error);
    return response.status(500).json({ message: "Error fetching orders" });
  }
});

// get all orders for admin (admin)
app.get("/orderslist", async (request, response) => {
  try {
    const getAllordersQuery = `
    SELECT *
    FROM addresses
    LEFT JOIN order_items ON addresses.order_id = order_items.order_id
    ORDER BY addresses.ordered_date DESC;`;

    const allOrdersResponse = await db.all(getAllordersQuery);

    // Group by order_id
    const ordersMap = {};

    allOrdersResponse.forEach((order) => {
      const {
        order_id,
        total_amount,
        ordered_date,
        updated_date,
        status,
        user_id,
        firstname,
        lastname,
        email,
        street,
        city,
        state,
        zipcode,
        country,
        phone,
        name,
        quantity,
        price,
        image,
        category,
      } = order;

      if (!ordersMap[order_id]) {
        ordersMap[order_id] = {
          order_id,
          address: {
            firstname,
            lastname,
            email,
            street,
            city,
            state,
            zipcode,
            country,
            phone,
          },
          total_amount,
          ordered_date,
          updated_date,
          status,
          user_id,
          items: [],
        };
      }

      ordersMap[order_id].items.push({
        name,
        category,
        image,
        quantity,
        price,
      });
    });

    // Convert map to array and ensure latest order appears first
    const finalOrders = Object.values(ordersMap).sort(
      (a, b) => new Date(b.ordered_date) - new Date(a.ordered_date)
    );

    return response.json(finalOrders);
  } catch (error) {
    console.log(error);
    response.json({ message: error });
  }
});

// status update api for orders (admin)
app.put("/update-status", async (request, response) => {
  const { order_id, status } = request.body;

  try {
    const statusUpdateQuery = `
      UPDATE addresses 
      SET status = ?
      WHERE order_id = ?;`;

    await db.run(statusUpdateQuery, [status, order_id]);

    response.json({
      message: `Order '#${order_id}' status updated to ${status}.`,
    });
  } catch (error) {
    console.log(error);
    response.json({ message: "Status Update failed" });
  }
});

module.exports = app;
