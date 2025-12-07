const express = require('express');
const router = express.Router();
const salesController = require('../controllers/salesController');

// Get sales data with filters, sorting, and pagination
router.get('/sales', salesController.getSalesData);

// Get filter options
router.get('/filter-options', salesController.getFilterOptions);

module.exports = router;

