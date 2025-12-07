const { getAllData, isDataLoaded } = require('../services/dataService');
const { applyFilters } = require('../services/filterService');
const { sortData } = require('../services/sortService');
const { paginateData } = require('../utils/paginationUtil');

/**
 * Get sales data with filters, sorting, and pagination
 */
function getSalesData(req, res) {
  if (!isDataLoaded()) {
    return res.status(503).json({ error: 'Data is still loading. Please try again.' });
  }

  const {
    search = '',
    customerRegion = '',
    gender = '',
    ageRange = '',
    productCategory = '',
    tags = '',
    paymentMethod = '',
    dateRange = '',
    sortBy = 'Customer Name',
    sortOrder = 'asc',
    page = 1,
    limit = 10
  } = req.query;

  try {
    // Get all data
    let data = getAllData();

    // Apply filters
    data = applyFilters(data, {
      search,
      customerRegion,
      gender,
      ageRange,
      productCategory,
      tags,
      paymentMethod,
      dateRange
    });

    // Apply sorting
    data = sortData(data, sortBy, sortOrder);

    // Apply pagination
    const result = paginateData(data, page, limit);

    res.json(result);
  } catch (error) {
    console.error('Error processing request:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * Get filter options
 */
function getFilterOptions(req, res) {
  if (!isDataLoaded()) {
    return res.status(503).json({ error: 'Data is still loading. Please try again.' });
  }

  try {
    const { getUniqueValues, getUniqueTags } = require('../services/dataService');

    const regions = getUniqueValues('Customer Region');
    const genders = getUniqueValues('Gender');
    const categories = getUniqueValues('Product Category');
    const paymentMethods = getUniqueValues('Payment Method');
    const tags = getUniqueTags();

    res.json({
      customerRegions: regions,
      genders: genders,
      ageRanges: ['18-25', '26-35', '36-50', '51+'],
      productCategories: categories,
      tags: tags,
      paymentMethods: paymentMethods,
      dateRanges: [
        { value: 'last7days', label: 'Last 7 Days' },
        { value: 'last30days', label: 'Last 30 Days' },
        { value: 'last90days', label: 'Last 90 Days' },
        { value: 'lastyear', label: 'Last Year' }
      ]
    });
  } catch (error) {
    console.error('Error getting filter options:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = {
  getSalesData,
  getFilterOptions
};

