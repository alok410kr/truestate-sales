const { getSalesData, getFilterOptions, isDataLoaded } = require('../services/dataService.postgres');

/**
 * Get sales data with filters, sorting, and pagination
 */
async function getSales(req, res) {
  if (!isDataLoaded()) {
    return res.status(503).json({ error: 'Database is still initializing. Please try again.' });
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
    // Parse multi-select filters
    const filters = {
      search,
      customerRegion: customerRegion ? customerRegion.split(',').filter(r => r) : [],
      gender: gender ? gender.split(',').filter(g => g) : [],
      ageRange: ageRange ? ageRange.split(',').filter(r => r) : [],
      productCategory: productCategory ? productCategory.split(',').filter(c => c) : [],
      tags: tags ? tags.split(',').filter(t => t) : [],
      paymentMethod: paymentMethod ? paymentMethod.split(',').filter(m => m) : [],
      dateRange
    };

    const result = await getSalesData(filters, sortBy, sortOrder, parseInt(page), parseInt(limit));
    res.json(result);
  } catch (error) {
    console.error('Error in getSales controller:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * Get filter options
 */
async function getFilters(req, res) {
  if (!isDataLoaded()) {
    return res.status(503).json({ error: 'Database is still initializing. Please try again.' });
  }

  try {
    const options = await getFilterOptions();
    res.json(options);
  } catch (error) {
    console.error('Error in getFilters controller:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = {
  getSales,
  getFilters
};

