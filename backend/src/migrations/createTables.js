const pool = require('../config/database');

/**
 * Create the sales table with all required columns
 */
async function createSalesTable() {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS sales (
      id SERIAL PRIMARY KEY,
      transaction_id VARCHAR(50),
      date DATE,
      customer_id VARCHAR(50),
      customer_name VARCHAR(100),
      phone_number VARCHAR(20),
      gender VARCHAR(10),
      age INTEGER,
      customer_region VARCHAR(50),
      customer_type VARCHAR(50),
      product_id VARCHAR(50),
      product_name VARCHAR(200),
      brand VARCHAR(100),
      product_category VARCHAR(50),
      tags TEXT,
      quantity INTEGER,
      price_per_unit DECIMAL(10,2),
      discount_percentage DECIMAL(5,2),
      total_amount DECIMAL(10,2),
      final_amount DECIMAL(10,2),
      payment_method VARCHAR(50),
      order_status VARCHAR(50),
      delivery_type VARCHAR(50),
      store_id VARCHAR(50),
      store_location VARCHAR(100),
      salesperson_id VARCHAR(50),
      employee_name VARCHAR(100),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    -- Create indexes for better query performance
    CREATE INDEX IF NOT EXISTS idx_customer_name ON sales(customer_name);
    CREATE INDEX IF NOT EXISTS idx_phone_number ON sales(phone_number);
    CREATE INDEX IF NOT EXISTS idx_customer_region ON sales(customer_region);
    CREATE INDEX IF NOT EXISTS idx_product_category ON sales(product_category);
    CREATE INDEX IF NOT EXISTS idx_payment_method ON sales(payment_method);
    CREATE INDEX IF NOT EXISTS idx_date ON sales(date);
    CREATE INDEX IF NOT EXISTS idx_gender ON sales(gender);
    CREATE INDEX IF NOT EXISTS idx_age ON sales(age);
  `;

  try {
    await pool.query(createTableQuery);
    console.log('✓ Sales table created successfully with indexes');
    return true;
  } catch (error) {
    console.error('Error creating sales table:', error);
    throw error;
  }
}

module.exports = { createSalesTable };

