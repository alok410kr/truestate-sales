/**
 * Filter service - handles all data filtering logic
 */

/**
 * Check if age is in specified range
 */
function isInAgeRange(age, range) {
  const ageNum = parseInt(age);
  if (isNaN(ageNum)) return false;

  switch (range) {
    case '18-25':
      return ageNum >= 18 && ageNum <= 25;
    case '26-35':
      return ageNum >= 26 && ageNum <= 35;
    case '36-50':
      return ageNum >= 36 && ageNum <= 50;
    case '51+':
      return ageNum >= 51;
    default:
      return true;
  }
}

/**
 * Check if date is in specified range
 */
function isInDateRange(date, range) {
  const dateObj = new Date(date);
  const now = new Date();
  
  switch (range) {
    case 'last7days': {
      const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      return dateObj >= sevenDaysAgo;
    }
    case 'last30days': {
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      return dateObj >= thirtyDaysAgo;
    }
    case 'last90days': {
      const ninetyDaysAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
      return dateObj >= ninetyDaysAgo;
    }
    case 'lastyear': {
      const lastYear = new Date(now.getFullYear() - 1, 0, 1);
      return dateObj >= lastYear;
    }
    default:
      return true;
  }
}

/**
 * Apply search filter
 */
function applySearchFilter(data, searchTerm) {
  if (!searchTerm) return data;
  
  const searchLower = searchTerm.toLowerCase();
  return data.filter(item =>
    item['Customer Name']?.toLowerCase().includes(searchLower) ||
    item['Phone Number']?.includes(searchTerm)
  );
}

/**
 * Apply multi-select filter
 */
function applyMultiSelectFilter(data, fieldName, values) {
  if (!values || values.length === 0) return data;
  
  return data.filter(item => values.includes(item[fieldName]));
}

/**
 * Apply age range filter
 */
function applyAgeRangeFilter(data, ranges) {
  if (!ranges || ranges.length === 0) return data;
  
  return data.filter(item =>
    ranges.some(range => isInAgeRange(item['Age'], range))
  );
}

/**
 * Apply tags filter
 */
function applyTagsFilter(data, tags) {
  if (!tags || tags.length === 0) return data;
  
  return data.filter(item => {
    const itemTags = item['Tags']?.split(',').map(t => t.trim()) || [];
    return tags.some(tag => itemTags.includes(tag));
  });
}

/**
 * Apply date range filter
 */
function applyDateRangeFilter(data, dateRange) {
  if (!dateRange) return data;
  
  return data.filter(item => isInDateRange(item['Date'], dateRange));
}

/**
 * Apply all filters to data
 */
function applyFilters(data, filters) {
  let filtered = [...data];

  // Search filter
  filtered = applySearchFilter(filtered, filters.search);

  // Customer Region filter
  if (filters.customerRegion) {
    const regions = filters.customerRegion.split(',').filter(r => r);
    filtered = applyMultiSelectFilter(filtered, 'Customer Region', regions);
  }

  // Gender filter
  if (filters.gender) {
    const genders = filters.gender.split(',').filter(g => g);
    filtered = applyMultiSelectFilter(filtered, 'Gender', genders);
  }

  // Age Range filter
  if (filters.ageRange) {
    const ranges = filters.ageRange.split(',').filter(r => r);
    filtered = applyAgeRangeFilter(filtered, ranges);
  }

  // Product Category filter
  if (filters.productCategory) {
    const categories = filters.productCategory.split(',').filter(c => c);
    filtered = applyMultiSelectFilter(filtered, 'Product Category', categories);
  }

  // Tags filter
  if (filters.tags) {
    const tagList = filters.tags.split(',').filter(t => t);
    filtered = applyTagsFilter(filtered, tagList);
  }

  // Payment Method filter
  if (filters.paymentMethod) {
    const methods = filters.paymentMethod.split(',').filter(m => m);
    filtered = applyMultiSelectFilter(filtered, 'Payment Method', methods);
  }

  // Date Range filter
  filtered = applyDateRangeFilter(filtered, filters.dateRange);

  return filtered;
}

module.exports = {
  applyFilters,
  isInAgeRange,
  isInDateRange
};

