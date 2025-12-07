/**
 * Sort service - handles data sorting logic
 */

/**
 * Sort data by specified field and order
 */
function sortData(data, sortBy, sortOrder) {
  const sorted = [...data];
  
  sorted.sort((a, b) => {
    let aVal = a[sortBy];
    let bVal = b[sortBy];

    // Handle numeric sorting
    if (sortBy === 'Age' || sortBy === 'Total Amount' || sortBy === 'Quantity') {
      aVal = parseFloat(aVal) || 0;
      bVal = parseFloat(bVal) || 0;
    }
    // Handle date sorting
    else if (sortBy === 'Date') {
      aVal = new Date(aVal);
      bVal = new Date(bVal);
    }
    // Handle string sorting
    else {
      aVal = String(aVal || '').toLowerCase();
      bVal = String(bVal || '').toLowerCase();
    }

    if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  return sorted;
}

module.exports = {
  sortData
};

