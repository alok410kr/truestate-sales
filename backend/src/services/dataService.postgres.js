const pool = require('../config/database');
const { createSalesTable } = require('../migrations/createTables');
const { importCSVData } = require('../migrations/importCSV');

let isDataLoaded = false;
let recordCount = 0;

/**
 * Initialize database: create tables and import data if needed
 */
async function initializeDatabase() {
  try {
    console.log('Initializing PostgreSQL database...');
    
    // Create tables
    await createSalesTable();
    
    // Import CSV data if database is empty
    const countResult = await pool.query('SELECT COUNT(*) FROM sales');
    recordCount = parseInt(countResult.rows[0].count);
    
    if (recordCount === 0) {
      console.log('Database is empty. Importing CSV data...');
      recordCount = await importCSVData();
    } else {
      console.log(`Database already contains ${recordCount} records`);
    }
    
    isDataLoaded = true;
    console.log('✓ Database initialized successfully');
    
    return recordCount;
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
}

/**
 * Get sales data with filters, sorting, and pagination
 */
async function getSalesData(filters, sortBy = 'customer_name', sortOrder = 'asc', page = 1, limit = 10) {
  try {
    const offset = (page - 1) * limit;
    let whereConditions = [];
    let queryParams = [];
    let paramIndex = 1;

    // Build WHERE conditions based on filters
    if (filters.search) {
      whereConditions.push(`(customer_name ILIKE $${paramIndex} OR phone_number LIKE $${paramIndex})`);
      queryParams.push(`%${filters.search}%`);
      paramIndex++;
    }

    if (filters.customerRegion && filters.customerRegion.length > 0) {
      whereConditions.push(`customer_region = ANY($${paramIndex})`);
      queryParams.push(filters.customerRegion);
      paramIndex++;
    }

    if (filters.gender && filters.gender.length > 0) {
      whereConditions.push(`gender = ANY($${paramIndex})`);
      queryParams.push(filters.gender);
      paramIndex++;
    }

    if (filters.ageRange && filters.ageRange.length > 0) {
      const ageConditions = filters.ageRange.map(range => {
        switch(range) {
          case '18-25': return 'age BETWEEN 18 AND 25';
          case '26-35': return 'age BETWEEN 26 AND 35';
          case '36-50': return 'age BETWEEN 36 AND 50';
          case '51+': return 'age >= 51';
          default: return '1=1';
        }
      });
      whereConditions.push(`(${ageConditions.join(' OR ')})`);
    }

    if (filters.productCategory && filters.productCategory.length > 0) {
      whereConditions.push(`product_category = ANY($${paramIndex})`);
      queryParams.push(filters.productCategory);
      paramIndex++;
    }

    if (filters.paymentMethod && filters.paymentMethod.length > 0) {
      whereConditions.push(`payment_method = ANY($${paramIndex})`);
      queryParams.push(filters.paymentMethod);
      paramIndex++;
    }

    if (filters.tags && filters.tags.length > 0) {
      const tagConditions = filters.tags.map(tag => `tags ILIKE '%${tag}%'`).join(' OR ');
      whereConditions.push(`(${tagConditions})`);
    }

    if (filters.dateRange) {
      const dateCondition = getDateRangeCondition(filters.dateRange);
      if (dateCondition) whereConditions.push(dateCondition);
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

    // Map sortBy to actual column names
    const columnMap = {
      'Customer Name': 'customer_name',
      'Date': 'date',
      'Total Amount': 'total_amount',
      'Age': 'age',
      'Transaction ID': 'transaction_id',
      'Quantity': 'quantity'
    };
    const sortColumn = columnMap[sortBy] || 'customer_name';
    const sortDirection = sortOrder.toUpperCase();

    // Get total count
    const countQuery = `SELECT COUNT(*) FROM sales ${whereClause}`;
    const countResult = await pool.query(countQuery, queryParams);
    const total = parseInt(countResult.rows[0].count);

    // Get paginated data
    const dataQuery = `
      SELECT 
        transaction_id as "Transaction ID",
        date as "Date",
        customer_id as "Customer ID",
        customer_name as "Customer Name",
        phone_number as "Phone Number",
        gender as "Gender",
        age as "Age",
        customer_region as "Customer Region",
        product_category as "Product Category",
        quantity as "Quantity",
        total_amount as "Total Amount",
        product_id as "Product ID",
        employee_name as "Employee Name"
      FROM sales
      ${whereClause}
      ORDER BY ${sortColumn} ${sortDirection}
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;
    
    queryParams.push(limit, offset);
    const dataResult = await pool.query(dataQuery, queryParams);

    return {
      data: dataResult.rows,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    };
  } catch (error) {
    console.error('Error fetching sales data:', error);
    throw error;
  }
}

/**
 * Get date range SQL condition
 */
function getDateRangeCondition(range) {
  const now = new Date();
  switch(range) {
    case 'last7days':
      return `date >= CURRENT_DATE - INTERVAL '7 days'`;
    case 'last30days':
      return `date >= CURRENT_DATE - INTERVAL '30 days'`;
    case 'last90days':
      return `date >= CURRENT_DATE - INTERVAL '90 days'`;
    case 'lastyear':
      return `date >= CURRENT_DATE - INTERVAL '1 year'`;
    default:
      return null;
  }
}

/**
 * Get unique filter values
 */
async function getFilterOptions() {
  try {
    const queries = [
      pool.query('SELECT DISTINCT customer_region FROM sales WHERE customer_region IS NOT NULL ORDER BY customer_region'),
      pool.query('SELECT DISTINCT gender FROM sales WHERE gender IS NOT NULL ORDER BY gender'),
      pool.query('SELECT DISTINCT product_category FROM sales WHERE product_category IS NOT NULL ORDER BY product_category'),
      pool.query('SELECT DISTINCT payment_method FROM sales WHERE payment_method IS NOT NULL ORDER BY payment_method'),
    ];

    const [regions, genders, categories, methods] = await Promise.all(queries);

    // Get unique tags
    const tagsResult = await pool.query('SELECT DISTINCT tags FROM sales WHERE tags IS NOT NULL');
    const allTags = new Set();
    tagsResult.rows.forEach(row => {
      if (row.tags) {
        row.tags.split(',').forEach(tag => allTags.add(tag.trim()));
      }
    });

    return {
      customerRegions: regions.rows.map(r => r.customer_region),
      genders: genders.rows.map(r => r.gender),
      ageRanges: ['18-25', '26-35', '36-50', '51+'],
      productCategories: categories.rows.map(r => r.product_category),
      tags: Array.from(allTags).sort(),
      paymentMethods: methods.rows.map(r => r.payment_method),
      dateRanges: [
        { value: 'last7days', label: 'Last 7 Days' },
        { value: 'last30days', label: 'Last 30 Days' },
        { value: 'last90days', label: 'Last 90 Days' },
        { value: 'lastyear', label: 'Last Year' }
      ]
    };
  } catch (error) {
    console.error('Error getting filter options:', error);
    throw error;
  }
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
  return recordCount;
}

module.exports = {
  initializeDatabase,
  getSalesData,
  getFilterOptions,
  isDataLoaded: getIsDataLoaded,
  getRecordCount
};

