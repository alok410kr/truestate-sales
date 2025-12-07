/**
 * Pagination utility functions
 */

/**
 * Paginate data
 */
function paginateData(data, page, limit) {
  const pageNum = parseInt(page) || 1;
  const limitNum = parseInt(limit) || 10;
  
  const startIndex = (pageNum - 1) * limitNum;
  const endIndex = startIndex + limitNum;
  
  const paginatedData = data.slice(startIndex, endIndex);
  
  return {
    data: paginatedData,
    pagination: {
      total: data.length,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(data.length / limitNum)
    }
  };
}

module.exports = {
  paginateData
};

