const express = require("express");
const cors = require("cors");
const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const multer = require("multer");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// app config
const app = express();
const port = 4000;

// middleware
app.use(cors());
app.use(express.json());

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
  response.send({ message: "Item added successfully!" });
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
  response.send({ message: "Item deleted successfully!" });
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
    response.send({ message: "Registered successfully!" });
  } else {
    response.send({ message: "User already exists!" });
  }
});

//user login api (frontend)
app.post("/login", async (request, response) => {
  const { email, password } = request.body;
  const checkUserQuery = `SELECT * FROM users WHERE email = '${email}';`;
  const dbUser = await db.get(checkUserQuery);

  if (dbUser === undefined) {
    response.send({ message: "Invalid User" });
  } else {
    const isPasswordMatched = await bcrypt.compare(password, dbUser.password);
    if (isPasswordMatched) {
      const payload = { email: email };
      const jwtToken = jwt.sign(payload, "my_token");
      response.send({ jwtToken: jwtToken, message: "Login successfull!" });
    } else {
      response.send({ message: "Invalid password!" });
    }
  }
});
