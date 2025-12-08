const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://truestate-sales.vercel.app',
    'https://truestate-sales-*.vercel.app'
  ],
  credentials: true
}));
app.use(express.json());

// Health check route
app.get('/api/health', (req, res) => {
  const { isDataLoaded, getRecordCount } = require('./services/dataService.postgres');
  res.json({
    status: 'ok',
    database: 'PostgreSQL',
    dataLoaded: isDataLoaded(),
    recordCount: getRecordCount()
  });
});

// Sales routes
const salesController = require('./controllers/salesController.postgres');
app.get('/api/sales', salesController.getSales);
app.get('/api/filter-options', salesController.getFilters);

// Initialize database and start server
const { initializeDatabase } = require('./services/dataService.postgres');

async function startServer() {
  try {
    console.log('Starting TruEstate Sales Management System...');
    console.log('Environment:', process.env.NODE_ENV);
    console.log('Using PostgreSQL database');
    
    // Initialize database (create tables, import data if needed)
    await initializeDatabase();
    
    // Start Express server
    app.listen(PORT, () => {
      console.log(`✓ Server running on port ${PORT}`);
      console.log(`✓ Health check: http://localhost:${PORT}/api/health`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

