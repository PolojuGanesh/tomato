--  CREATE TABLE IF NOT EXISTS products (
--    id INTEGER PRIMARY KEY AUTOINCREMENT,
--    image TEXT NOT NULL,
--    name TEXT NOT NULL,
--    description TEXT NOT NULL,
--    category TEXT NOT NULL,
--    price INTEGER NOT NULL
-- );

-- delete from cart
-- where cart_id = 1;

-- ALTER TABLE products
-- RENAME COLUMN id to _id;

-- CREATE TABLE users (
--   id INTEGER PRIMARY KEY AUTOINCREMENT,
--   username TEXT NOT NULL,
--   password TEXT NOT NULL,
--   email TEXT NOT NULL UNIQUE
-- );

-- ALTER TABLE users
-- RENAME COLUMN user_id to id;

-- CREATE TABLE cart (
--     cart_id INTEGER PRIMARY KEY AUTOINCREMENT,
--     user_id INTEGER,
--     product_id INTEGER,
--     quantity INTEGER NOT NULL DEFAULT 1,
--     added_at DATETIME DEFAULT CURRENT_TIMESTAMP,
--     FOREIGN KEY (user_id) REFERENCES users(id),
--     FOREIGN KEY (product_id) REFERENCES products(_id)
-- );

-- CREATE TABLE cart (
--     cart_id INTEGER PRIMARY KEY AUTOINCREMENT,
--     user_id INTEGER,
--     product_id INTEGER,
--     quantity INTEGER NOT NULL DEFAULT 1,
--     price INTEGER NOT NULL,
--     FOREIGN KEY (user_id) REFERENCES users(id),
--     FOREIGN KEY (product_id) REFERENCES products(_id)
-- );

-- DROP TABLE cart;

-- DELETE FROM cart;

-- CREATE TABLE addresses (
--     id INTEGER PRIMARY KEY AUTOINCREMENT,
--     user_id INTEGER,
--     firstname TEXT NOT NULL,
--     lastname TEXT NOT NULL,
--     email TEXT NOT NULL,
--     street TEXT NOT NULL,
--     city TEXT NOT NULL,
--     state TEXT NOT NULL,
--     zipcode TEXT NOT NULL,
--     country TEXT NOT NULL,
--     phone TEXT NOT NULL,
--     status TEXT NOT NULL DEFAULT "Food Processing",
--     ordered_date DATETIME DEFAULT CURRENT_TIMESTAMP,
--     updated_date DATETIME DEFAULT CURRENT_TIMESTAMP,
--     FOREIGN KEY (user_id) REFERENCES users(id)
-- )


-- DELETE FROM addresses;

-- ALTER TABLE addresses
-- ADD COLUMN total_amount INTEGER;

-- ALTER TABLE addresses
-- RENAME COLUMN payment TO order_id;

-- CREATE TABLE IF NOT EXISTS orders (
--   order_id TEXT PRIMARY KEY,
--   order_status TEXT,
--   raw_response TEXT
-- );

-- DELETE FROM cart;

-- DELETE FROM order_items;

-- SELECT * FROM 
-- (products INNER JOIN cart ON products._id = cart.product_id) 
-- AS candp INNER JOIN addresses ON 
-- candp.user_id = addresses.user_id 
-- WHERE cart.user_id = 26;

-- SELECT * FROM (cart INNER JOIN products ON cart.product_id = products._id)
-- AS tbone INNER JOIN addresses ON tbone.user_id = addresses.user_id;

-- CREATE TABLE IF NOT EXISTS order_items (
--   id INTEGER PRIMARY KEY AUTOINCREMENT,
--   order_id TEXT,
--   product_id INTEGER,
--   name TEXT,
--   price REAL,
--   quantity INTEGER,
--   image TEXT
-- );
