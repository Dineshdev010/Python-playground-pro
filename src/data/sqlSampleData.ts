export const SQL_PRACTICE_DB_NAME = "ShopDB";
export const SQL_PRACTICE_DB_TABLES = ["customers", "products", "orders", "order_items"] as const;

export const SQL_PRACTICE_DB_SETUP_SQL = `
-- Practice database: ShopDB (SQLite)
-- This script is executed before every SQL run to provide consistent sample data.

DROP TABLE IF EXISTS product_reviews;
DROP TABLE IF EXISTS order_items;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS customers;

CREATE TABLE customers (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  city TEXT NOT NULL,
  signup_date TEXT NOT NULL
);

CREATE TABLE products (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  price INTEGER NOT NULL
);

CREATE TABLE orders (
  id INTEGER PRIMARY KEY,
  customer_id INTEGER NOT NULL,
  order_date TEXT NOT NULL,
  status TEXT NOT NULL,
  FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
);

CREATE TABLE order_items (
  order_id INTEGER NOT NULL,
  product_id INTEGER NOT NULL,
  quantity INTEGER NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

CREATE TABLE product_reviews (
  id INTEGER PRIMARY KEY,
  product_id INTEGER NOT NULL,
  customer_id INTEGER NOT NULL,
  rating INTEGER CHECK(rating BETWEEN 1 AND 5),
  review_text TEXT,
  review_date TEXT,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
);

INSERT INTO customers (id, name, city, signup_date) VALUES
  (1, 'Alice Johnson', 'Mumbai', '2025-12-20'),
  (2, 'Bob Sharma', 'Delhi', '2025-12-28'),
  (3, 'Charlie Dave', 'Bengaluru', '2026-01-10'),
  (4, 'Diana Prince', 'Mumbai', '2026-02-01'),
  (5, 'Ethan Hunt', 'Pune', '2026-02-20'),
  (6, 'Fiona Apple', 'Chennai', '2026-03-05'),
  (7, 'George Miller', 'Delhi', '2026-03-12'),
  (8, 'Hannah Abbott', 'Kolkata', '2026-03-20'),
  (9, 'Ian Wright', 'Hyderabad', '2026-03-25'),
  (10, 'Julia Roberts', 'Mumbai', '2026-04-01'),
  (11, 'Kevin Hart', 'Bengaluru', '2026-04-05'),
  (12, 'Laura Palmer', 'Pune', '2026-04-10'),
  (13, 'Mike Ross', 'Delhi', '2026-04-15'),
  (14, 'Nina Simone', 'Chennai', '2026-04-20'),
  (15, 'Oscar Wilde', 'Kolkata', '2026-04-25');

INSERT INTO products (id, name, category, price) VALUES
  (1, 'Logitech Mouse', 'Electronics', 800),
  (2, 'Mechanical Keyboard', 'Electronics', 2500),
  (3, 'Sony Headphones', 'Electronics', 4500),
  (4, 'Dell 24" Monitor', 'Electronics', 12000),
  (5, 'Parker Pen', 'Stationery', 500),
  (6, 'Moleskine Diary', 'Stationery', 1200),
  (7, 'Steelo Water Bottle', 'Home', 450),
  (8, 'Nescafe Coffee', 'Grocery', 350),
  (9, 'Organic Tea', 'Grocery', 250),
  (10, 'Lays Chips', 'Grocery', 20),
  (11, 'Python Book', 'Books', 800),
  (12, 'SQL Masterclass', 'Books', 1200),
  (13, 'Yoga Mat', 'Fitness', 900),
  (14, 'Dumbbell 5kg', 'Fitness', 1500),
  (15, 'Resistance Band', 'Fitness', 400),
  (16, 'Table Lamp', 'Home', 1100),
  (17, 'Cushion Cover', 'Home', 300),
  (18, 'Data Science Cap', 'Apparel', 600),
  (19, 'PyMaster Hoodie', 'Apparel', 2200),
  (20, 'Algorithmic Socks', 'Apparel', 400);

INSERT INTO orders (id, customer_id, order_date, status) VALUES
  (1, 1, '2026-01-05', 'completed'),
  (2, 2, '2026-01-06', 'completed'),
  (3, 1, '2026-02-10', 'cancelled'),
  (4, 3, '2026-03-12', 'completed'),
  (5, 4, '2026-03-15', 'completed'),
  (6, 5, '2026-03-18', 'processing'),
  (7, 6, '2026-03-20', 'completed'),
  (8, 7, '2026-03-25', 'shipped'),
  (9, 8, '2026-03-28', 'completed'),
  (10, 9, '2026-04-01', 'completed'),
  (11, 10, '2026-04-02', 'processing'),
  (12, 11, '2026-04-05', 'completed'),
  (13, 12, '2026-04-08', 'shipped'),
  (14, 13, '2026-04-10', 'completed'),
  (15, 14, '2026-04-12', 'pending'),
  (16, 1, '2026-04-15', 'completed'),
  (17, 2, '2026-04-18', 'completed'),
  (18, 15, '2026-04-20', 'completed'),
  (19, 3, '2026-04-22', 'processing'),
  (20, 6, '2026-04-25', 'completed');

INSERT INTO order_items (order_id, product_id, quantity) VALUES
  (1, 1, 1), (1, 8, 2), (1, 5, 1),
  (2, 3, 1), (2, 2, 1),
  (3, 4, 1),
  (4, 11, 1), (4, 12, 1),
  (5, 7, 2), (5, 9, 1),
  (6, 13, 1), (6, 15, 2),
  (7, 19, 1), (7, 20, 3),
  (8, 2, 1), (8, 6, 1),
  (9, 3, 1), (9, 16, 2),
  (10, 10, 10), (10, 8, 1),
  (11, 4, 1),
  (12, 14, 2), (12, 13, 1),
  (13, 1, 1), (13, 16, 1),
  (14, 18, 1), (14, 19, 1),
  (15, 9, 4),
  (16, 2, 1), (16, 3, 1),
  (17, 11, 3),
  (18, 6, 2), (18, 5, 1),
  (19, 20, 5),
  (20, 15, 1);

INSERT INTO product_reviews (id, product_id, customer_id, rating, review_text, review_date) VALUES
  (1, 1, 1, 5, 'Great mouse for the price!', '2026-01-10'),
  (2, 3, 2, 4, 'Excellent sound quality, slightly heavy.', '2026-01-15'),
  (3, 11, 3, 5, 'Must read for Python beginners.', '2026-03-20'),
  (4, 19, 6, 5, 'Cozy and stylish hoodie!', '2026-04-28'),
  (5, 5, 1, 3, 'Ink flow is okay but grip is hard.', '2026-02-15'),
  (6, 8, 4, 4, 'My morning ritual coffee.', '2026-03-20'),
  (7, 13, 5, 5, 'Perfect grip for yoga.', '2026-03-25');

`;

