const mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Rudra@123',
  database: 'Flipr',
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL: ' + err);
    return;
  }
  console.log('Connected to MySQL');
});

const Customer = () => {
  const query = `
    CREATE TABLE IF NOT EXISTS customers (
      customer_id INT AUTO_INCREMENT PRIMARY KEY,
      customer_name VARCHAR(255),
      email VARCHAR(255),
      mobile_number VARCHAR(15),
      city VARCHAR(255)
    );
  `;
  connection.query(query, (err, results) => {
    if (err) throw err;
    console.log('Customer table created or already exists.');
  });
};

// Create Purchase Order table
const PurchaseOrder = () => {
  const query = `
    CREATE TABLE IF NOT EXISTS purchase_orders (
      purchase_order_id INT AUTO_INCREMENT PRIMARY KEY,
      product_name VARCHAR(255),
      quantity INT,
      pricing DECIMAL(10, 2),
      mrp DECIMAL(10, 2),
      customer_id INT,
      FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
    );
  `;
  connection.query(query, (err, results) => {
    if (err) throw err;
    console.log('Purchase Order table created or already exists.');
  });
};

const ShippingDetails = () => {
  const query = `
    CREATE TABLE IF NOT EXISTS shipping_details (
      shipping_id INT AUTO_INCREMENT PRIMARY KEY,
      address VARCHAR(255),
      city VARCHAR(255),
      pincode VARCHAR(10),
      purchase_order_id INT,
      customer_id INT,
      FOREIGN KEY (purchase_order_id) REFERENCES purchase_orders(purchase_order_id),
      FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
    );
  `;
  connection.query(query, (err, results) => {
    if (err) throw err;
    console.log('Shipping Details table created or already exists.');
  });
};

module.exports = {
  Customer,
  PurchaseOrder,
  ShippingDetails,
  connection, // Exporting the connection for use in other modules
};
