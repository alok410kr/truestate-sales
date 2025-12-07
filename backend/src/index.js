const express = require('express');
const cors = require('cors');
const salesRoutes = require('./routes/salesRoutes');
const { loadCSVData } = require('./services/dataService');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Health check route
app.get('/api/health', (req, res) => {
  const { isDataLoaded, getRecordCount } = require('./services/dataService');
  res.json({
    status: 'ok',
    dataLoaded: isDataLoaded(),
    recordCount: getRecordCount()
  });
});

// Sales routes
app.use('/api', salesRoutes);

// Start server
loadCSVData()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Data loaded: ${require('./services/dataService').getRecordCount()} records`);
    });
  })
  .catch(error => {
    console.error('Error loading CSV data:', error);
    process.exit(1);
  });

