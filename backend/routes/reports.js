const express = require('express');
const router = express.Router();

// Get daily report
router.get('/daily', (req, res) => {
  res.json({
    date: new Date().toLocaleDateString('en-IN'),
    orders: 127,
    sales: 18950,
    cash: 6000,
    upi: 12950,
    card: 0,
    avgBill: 149,
    topItem: 'Chicken Loaded Fries',
    peakHour: '7PM - 9PM'
  });
});

// Get weekly report
router.get('/weekly', (req, res) => {
  res.json({
    week: 'Current Week',
    data: [
      { day: 'Mon', orders: 95, sales: 14200 },
      { day: 'Tue', orders: 110, sales: 16500 },
      { day: 'Wed', orders: 88, sales: 13100 },
      { day: 'Thu', orders: 120, sales: 17800 },
      { day: 'Fri', orders: 145, sales: 21600 },
      { day: 'Sat', orders: 165, sales: 24500 },
      { day: 'Sun', orders: 155, sales: 23100 },
    ],
    totalOrders: 878,
    totalRevenue: 130800,
    avgDaily: 18686
  });
});

// Get monthly report
router.get('/monthly', (req, res) => {
  res.json({
    month: 'June 2026',
    revenue: 425000,
    orders: 3820,
    avgBill: 111,
    growth: '+12%',
    bestDay: 'Saturday',
    cashPercent: 32,
    upiPercent: 68
  });
});

module.exports = router;
