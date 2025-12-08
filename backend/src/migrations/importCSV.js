const fs = require('fs');
const csv = require('csv-parser');
const path = require('path');
const pool = require('../config/database');

/**
 * Import CSV data into PostgreSQL
 * This script can handle large CSV files by batching inserts
 */
async function importCSVData() {
  const dataPath = path.join(__dirname, '..', '..', 'sample_data.csv');
  
  console.log('Starting CSV import...');
  console.log(`Reading from: ${dataPath}`);

  // Check if data already exists
  const checkQuery = 'SELECT COUNT(*) FROM sales';
  const checkResult = await pool.query(checkQuery);
  const existingCount = parseInt(checkResult.rows[0].count);

  if (existingCount > 0) {
    console.log(`Database already contains ${existingCount} records`);
    console.log('Skipping import. Delete existing data first if you want to re-import.');
    return existingCount;
  }

  return new Promise((resolve, reject) => {
    const results = [];
    let processed = 0;
    const BATCH_SIZE = 1000;

    fs.createReadStream(dataPath)
      .pipe(csv())
      .on('data', (data) => {
        results.push(data);
        
        // Process in batches
        if (results.length >= BATCH_SIZE) {
          processedBatch = results.splice(0, BATCH_SIZE);
          insertBatch(processedBatch).then(() => {
            processed += processedBatch.length;
            console.log(`Imported ${processed} records...`);
          });
        }
      })
      .on('end', async () => {
        // Insert remaining records
        if (results.length > 0) {
          await insertBatch(results);
          processed += results.length;
        }
        console.log(`✓ CSV import completed! Total records: ${processed}`);
        resolve(processed);
      })
      .on('error', (error) => {
        console.error('Error reading CSV:', error);
        reject(error);
      });
  });
}

/**
 * Insert a batch of records into PostgreSQL
 */
async function insertBatch(records) {
  if (records.length === 0) return;

  const values = [];
  const placeholders = [];
  
  records.forEach((record, index) => {
    const offset = index * 26;
    placeholders.push(
      `($${offset + 1}, $${offset + 2}, $${offset + 3}, $${offset + 4}, $${offset + 5}, 
        $${offset + 6}, $${offset + 7}, $${offset + 8}, $${offset + 9}, $${offset + 10}, 
        $${offset + 11}, $${offset + 12}, $${offset + 13}, $${offset + 14}, $${offset + 15}, 
        $${offset + 16}, $${offset + 17}, $${offset + 18}, $${offset + 19}, $${offset + 20}, 
        $${offset + 21}, $${offset + 22}, $${offset + 23}, $${offset + 24}, $${offset + 25}, $${offset + 26})`
    );
    
    values.push(
      record['Transaction ID'],
      record['Date'],
      record['Customer ID'],
      record['Customer Name'],
      record['Phone Number'],
      record['Gender'],
      parseInt(record['Age']) || 0,
      record['Customer Region'],
      record['Customer Type'],
      record['Product ID'],
      record['Product Name'],
      record['Brand'],
      record['Product Category'],
      record['Tags'],
      parseInt(record['Quantity']) || 0,
      parseFloat(record['Price per Unit']) || 0,
      parseFloat(record['Discount Percentage']) || 0,
      parseFloat(record['Total Amount']) || 0,
      parseFloat(record['Final Amount']) || 0,
      record['Payment Method'],
      record['Order Status'],
      record['Delivery Type'],
      record['Store ID'],
      record['Store Location'],
      record['Salesperson ID'],
      record['Employee Name']
    );
  });

  const insertQuery = `
    INSERT INTO sales (
      transaction_id, date, customer_id, customer_name, phone_number,
      gender, age, customer_region, customer_type, product_id,
      product_name, brand, product_category, tags, quantity,
      price_per_unit, discount_percentage, total_amount, final_amount,
      payment_method, order_status, delivery_type, store_id,
      store_location, salesperson_id, employee_name
    ) VALUES ${placeholders.join(', ')}
  `;

  try {
    await pool.query(insertQuery, values);
  } catch (error) {
    console.error('Error inserting batch:', error.message);
    throw error;
  }
}

module.exports = { importCSVData };

