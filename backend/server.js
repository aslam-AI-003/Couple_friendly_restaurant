const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const ordersRouter = require('./routes/orders');
const productsRouter = require('./routes/products');
const reportsRouter = require('./routes/reports');
const stockRouter = require('./routes/stock');

app.use('/api/orders', ordersRouter);
app.use('/api/products', productsRouter);
app.use('/api/reports', reportsRouter);
app.use('/api/stock', stockRouter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Couple Friendly Hub API is running!' });
});

app.listen(PORT, () => {
  console.log(`🚀 Couple Friendly Hub API running on port ${PORT}`);
});
