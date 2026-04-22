const sqlite3 = require('sqlite3').verbose();

const setupSql = `
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
  (5, 7, 2), (5, 9, 1);
`;

const db = new sqlite3.Database(':memory:');

db.serialize(() => {
  db.exec(setupSql, async (err) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }

    const queries = [
      { id: 'intro-beg', q: "SELECT id, name FROM customers ORDER BY id LIMIT 5" },
      { id: 'intro-int', q: "SELECT name, price FROM products WHERE category = 'Electronics' ORDER BY price DESC" },
      { id: 'intro-adv', q: "SELECT name, price FROM products ORDER BY price DESC LIMIT 3" },
      { id: 'filt-beg', q: "SELECT name, city FROM customers WHERE city = 'Mumbai' ORDER BY name" },
      { id: 'filt-int', q: "SELECT id, order_date, status FROM orders WHERE order_date LIKE '2026-03-%' ORDER BY order_date" },
      { id: 'filt-adv', q: "SELECT name, price FROM products WHERE price BETWEEN 100 AND 2000 ORDER BY price" },
      { id: 'agg-beg', q: "SELECT status, COUNT(*) AS count FROM orders GROUP BY status ORDER BY status" },
      { id: 'agg-int', q: "SELECT p.name, SUM(oi.quantity) AS total_qty FROM order_items oi JOIN products p ON p.id = oi.product_id JOIN orders o ON o.id = oi.order_id WHERE o.status = 'completed' GROUP BY p.name ORDER BY total_qty DESC, p.name" },
      { id: 'agg-adv', q: "SELECT oi.order_id, SUM(p.price * oi.quantity) AS revenue FROM order_items oi JOIN products p ON p.id = oi.product_id JOIN orders o ON o.id = oi.order_id WHERE o.status = 'completed' GROUP BY oi.order_id ORDER BY oi.order_id" },
      { id: 'join-beg', q: "SELECT o.id AS order_id, c.name, o.status FROM orders o JOIN customers c ON c.id = o.customer_id ORDER BY o.id LIMIT 5" },
      { id: 'join-int', q: "SELECT oi.order_id, p.name AS product, oi.quantity FROM order_items oi JOIN products p ON p.id = oi.product_id WHERE oi.order_id = 1 ORDER BY product" },
      { id: 'join-adv', q: "SELECT c.name, COALESCE(SUM(p.price * oi.quantity), 0) AS total_spent FROM customers c LEFT JOIN orders o ON o.customer_id = c.id AND o.status = 'completed' LEFT JOIN order_items oi ON oi.order_id = o.id LEFT JOIN products p ON p.id = oi.product_id GROUP BY c.name ORDER BY total_spent DESC, c.name LIMIT 5" },
      { id: 'sub-beg', q: "SELECT DISTINCT c.name FROM customers c JOIN orders o ON o.customer_id = c.id WHERE o.status = 'cancelled' ORDER BY c.name" },
      { id: 'sub-int', q: "SELECT name FROM products WHERE id NOT IN (SELECT product_id FROM order_items) ORDER BY name LIMIT 5" },
    ];

    for (const item of queries) {
      db.all(item.q, (err, rows) => {
        if (err) {
          console.error(`Error in ${item.id}:`, err);
          return;
        }

        const headers = Object.keys(rows[0] || {}).join(',');
        const content = rows.map(r => Object.values(r).join(',')).join('\\n');
        console.log(`--- ${item.id} ---`);
        console.log(`${headers}\\n${content}`);
      });
    }
  });
});
