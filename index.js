// index.js

const express = require('express');
const bodyParser = require('body-parser');
const { Customer, PurchaseOrder, ShippingDetails, connection } = require('./users');

const app = express();

app.use(bodyParser.json());

// Create tables
Customer();
PurchaseOrder();
ShippingDetails();

app.post('/api/customer', (req, res) => {
  const { customer_name, email, mobile_number, city } = req.body;
  const query = 'INSERT INTO customers (customer_name, email, mobile_number, city) VALUES (?, ?, ?, ?)';
  connection.query(query, [customer_name, email, mobile_number, city], (err, results) => {
    if (err) throw err;
    res.json({ message: 'Customer added successfully.' });
  });
});

app.post('/api/purchaseorders', (req, res) => {
  const { product_name, quantity, pricing, mrp, customer_id } = req.body;
  const query = 'INSERT INTO purchase_orders (product_name, quantity, pricing, mrp, customer_id) VALUES (?, ?, ?, ?, ?)';
  connection.query(query, [product_name, quantity, pricing, mrp, customer_id], (err, results) => {
    if (err) throw err;
    res.json({ message: 'Purchase order added successfully.' });
  });
});

app.post('/api/shipping', (req, res) => {
  const { address, city, pincode, purchase_order_id, customer_id } = req.body;
  const query = 'INSERT INTO shipping_details (address, city, pincode, purchase_order_id, customer_id) VALUES (?, ?, ?, ?, ?)';
  connection.query(query, [address, city, pincode, purchase_order_id, customer_id], (err, results) => {
    if (err) throw err;
    res.json({ message: 'Shipping details added successfully.' });
  });
});

app.get('/api/customershipment', (req, res) => {
  const { city } = req.query;
  const query = `
    SELECT customers.customer_name, customers.email, customers.mobile_number, customers.city
    FROM customers
    INNER JOIN shipping_details ON customers.customer_id = shipping_details.customer_id
    WHERE shipping_details.city = ?
  `;
  connection.query(query, [city], (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

app.get('/api/customerpurchase', (req, res) => {
  const query = `
    SELECT customers.customer_name, customers.email, customers.mobile_number, customers.city, purchase_orders.product_name, purchase_orders.quantity, purchase_orders.pricing, purchase_orders.mrp
    FROM customers
    LEFT JOIN purchase_orders ON customers.customer_id = purchase_orders.customer_id
  `;
  connection.query(query, (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

app.listen(8080, () => {
  console.log(`Server is running on port 8080`);
});
