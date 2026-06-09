const express = require('express');
const router = express.Router();

// Menu items (in production, fetch from Firebase)
let products = [
  { id: 'lf-001', name: 'Classic Fries', category: 'Loaded Fries', price: 79, stock: 100, isVeg: true, isAvailable: true },
  { id: 'lf-002', name: 'Cheese Fries', category: 'Loaded Fries', price: 109, stock: 80, isVeg: true, isAvailable: true },
  { id: 'lf-003', name: 'Veg Loaded Fries', category: 'Loaded Fries', price: 119, stock: 75, isVeg: true, isAvailable: true },
  { id: 'lf-004', name: 'Chicken Loaded Fries', category: 'Loaded Fries', price: 139, stock: 90, isVeg: false, isAvailable: true },
  { id: 'lf-005', name: 'Peri Peri Fries', category: 'Loaded Fries', price: 99, stock: 85, isVeg: true, isAvailable: true },
  { id: 'wr-001', name: 'Paneer Wrap', category: 'Wraps', price: 109, stock: 60, isVeg: true, isAvailable: true },
  { id: 'wr-002', name: 'Chicken Wrap', category: 'Wraps', price: 129, stock: 70, isVeg: false, isAvailable: true },
  { id: 'mm-001', name: 'Veg Momos (6 pcs)', category: 'Momos', price: 79, stock: 100, isVeg: true, isAvailable: true },
  { id: 'mm-002', name: 'Chicken Momos (6 pcs)', category: 'Momos', price: 99, stock: 90, isVeg: false, isAvailable: true },
  { id: 'mj-001', name: 'Mint Mojito', category: 'Mojito & Drinks', price: 59, stock: 150, isVeg: true, isAvailable: true },
  { id: 'mj-002', name: 'Blue Lagoon', category: 'Mojito & Drinks', price: 69, stock: 120, isVeg: true, isAvailable: true },
];

// Get all products
router.get('/', (req, res) => {
  res.json(products);
});

// Get products by category
router.get('/category/:category', (req, res) => {
  const filtered = products.filter(p => p.category === req.params.category);
  res.json(filtered);
});

// Add new product
router.post('/', (req, res) => {
  const product = { id: `custom-${Date.now()}`, ...req.body, isAvailable: true };
  products.push(product);
  res.status(201).json(product);
});

// Update product
router.put('/:id', (req, res) => {
  const index = products.findIndex(p => p.id === req.params.id);
  if (index === -1) return res.status(404).json({ message: 'Product not found' });
  products[index] = { ...products[index], ...req.body };
  res.json(products[index]);
});

// Delete product
router.delete('/:id', (req, res) => {
  products = products.filter(p => p.id !== req.params.id);
  res.json({ message: 'Product deleted' });
});

// Toggle availability
router.patch('/:id/toggle', (req, res) => {
  const product = products.find(p => p.id === req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found' });
  product.isAvailable = !product.isAvailable;
  res.json(product);
});

module.exports = router;
