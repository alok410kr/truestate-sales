const fs = require('fs');
const csv = require('csv-parser');
const path = require('path');

let salesData = [];
let isDataLoaded = false;

/**
 * Load CSV data into memory
 */
function loadCSVData() {
  return new Promise((resolve, reject) => {
    // Use sample data for deployment (10k rows) or full dataset locally
    const dataPath = path.join(__dirname, '..', '..', process.env.NODE_ENV === 'production' ? 'sample_data.csv' : '../truestate_assignment_dataset.csv');
    const results = [];

    fs.createReadStream(dataPath)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => {
        salesData = results;
        isDataLoaded = true;
        console.log(`Loaded ${salesData.length} records`);
        resolve();
      })
      .on('error', (error) => reject(error));
  });
}

/**
 * Get all sales data
 */
function getAllData() {
  return salesData;
}

/**
 * Check if data is loaded
 */
function getIsDataLoaded() {
  return isDataLoaded;
}

/**
 * Get record count
 */
function getRecordCount() {
  return salesData.length;
}

/**
 * Get unique values for a field
 */
function getUniqueValues(fieldName) {
  return [...new Set(salesData.map(item => item[fieldName]))].filter(Boolean).sort();
}

/**
 * Get unique tags from all records
 */
function getUniqueTags() {
  const allTags = new Set();
  salesData.forEach(item => {
    if (item['Tags']) {
      item['Tags'].split(',').forEach(tag => allTags.add(tag.trim()));
    }
  });
  return [...allTags].sort();
}

module.exports = {
  loadCSVData,
  getAllData,
  isDataLoaded: getIsDataLoaded,
  getRecordCount,
  getUniqueValues,
  getUniqueTags
};

