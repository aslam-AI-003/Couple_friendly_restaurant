const express = require('express');
const router = express.Router();

// In-memory orders store (replace with Firebase in production)
let orders = [];
let orderCounter = 1020;

// Get all orders
router.get('/', (req, res) => {
  res.json(orders);
});

// Get today's orders
router.get('/today', (req, res) => {
  const today = new Date().toDateString();
  const todayOrders = orders.filter(o => new Date(o.createdAt).toDateString() === today);
  res.json(todayOrders);
});

// Create new order
router.post('/', (req, res) => {
  const { customerName, customerMobile, items, paymentMethod, subtotal, gst, total } = req.body;
  
  orderCounter++;
  const order = {
    id: orderCounter,
    billNo: `#${orderCounter}`,
    customerName,
    customerMobile,
    items,
    paymentMethod,
    subtotal,
    gst,
    total,
    status: 'completed',
    createdAt: new Date().toISOString()
  };

  orders.push(order);
  res.status(201).json(order);
});

// Get order by ID
router.get('/:id', (req, res) => {
  const order = orders.find(o => o.id === parseInt(req.params.id));
  if (!order) return res.status(404).json({ message: 'Order not found' });
  res.json(order);
});

// Get daily summary
router.get('/summary/daily', (req, res) => {
  const today = new Date().toDateString();
  const todayOrders = orders.filter(o => new Date(o.createdAt).toDateString() === today);
  
  const summary = {
    totalOrders: todayOrders.length,
    totalSales: todayOrders.reduce((sum, o) => sum + o.total, 0),
    cashCollection: todayOrders.filter(o => o.paymentMethod === 'Cash').reduce((sum, o) => sum + o.total, 0),
    upiCollection: todayOrders.filter(o => o.paymentMethod === 'UPI').reduce((sum, o) => sum + o.total, 0),
    cardCollection: todayOrders.filter(o => o.paymentMethod === 'Card').reduce((sum, o) => sum + o.total, 0),
  };

  res.json(summary);
});

module.exports = router;
