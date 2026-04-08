export const SQL_PRACTICE_DB_NAME = "ShopDB";
export const SQL_PRACTICE_DB_TABLES = ["customers", "products", "orders", "order_items"] as const;

export const SQL_PRACTICE_DB_SETUP_SQL = `
-- Practice database: ShopDB (SQLite)
-- This script is executed before every SQL run to provide consistent sample data.

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
  FOREIGN KEY (customer_id) REFERENCES customers(id)
);

CREATE TABLE order_items (
  order_id INTEGER NOT NULL,
  product_id INTEGER NOT NULL,
  quantity INTEGER NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(id),
  FOREIGN KEY (product_id) REFERENCES products(id)
);

INSERT INTO customers (id, name, city, signup_date) VALUES
  (1, 'Alice',   'Mumbai',     '2025-12-20'),
  (2, 'Bob',     'Delhi',      '2025-12-28'),
  (3, 'Charlie', 'Bengaluru',  '2026-01-10'),
  (4, 'Diana',   'Mumbai',     '2026-02-01'),
  (5, 'Ethan',   'Pune',       '2026-02-20');

INSERT INTO products (id, name, category, price) VALUES
  (1, 'Notebook',   'Stationery', 50),
  (2, 'Pen',        'Stationery', 10),
  (3, 'Headphones', 'Electronics', 1500),
  (4, 'Keyboard',   'Electronics', 2500),
  (5, 'Coffee',     'Grocery', 120),
  (6, 'Mouse',      'Electronics', 800);

INSERT INTO orders (id, customer_id, order_date, status) VALUES
  (1, 1, '2026-01-05', 'completed'),
  (2, 2, '2026-01-06', 'completed'),
  (3, 1, '2026-02-10', 'cancelled'),
  (4, 3, '2026-03-12', 'completed'),
  (5, 4, '2026-03-15', 'completed');

INSERT INTO order_items (order_id, product_id, quantity) VALUES
  (1, 1, 2),
  (1, 2, 5),
  (1, 5, 1),
  (2, 3, 1),
  (3, 2, 10),
  (4, 4, 1),
  (4, 5, 3),
  (5, 1, 1),
  (5, 3, 2);
`;

