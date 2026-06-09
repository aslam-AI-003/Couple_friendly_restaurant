const express = require('express');
const router = express.Router();

let stockItems = [
  { id: 1, name: 'Frozen Fries', category: 'Fries', quantity: 20, unit: 'KG', minStock: 10 },
  { id: 2, name: 'Cheese Slices', category: 'Fries', quantity: 50, unit: 'pcs', minStock: 30 },
  { id: 3, name: 'Chicken Chunks', category: 'Fries', quantity: 8, unit: 'KG', minStock: 5 },
  { id: 4, name: 'Mint Leaves', category: 'Mojito', quantity: 5, unit: 'KG', minStock: 2 },
  { id: 5, name: 'Lemon', category: 'Mojito', quantity: 10, unit: 'KG', minStock: 3 },
  { id: 6, name: 'Sugar Syrup', category: 'Mojito', quantity: 15, unit: 'Litre', minStock: 5 },
  { id: 7, name: 'Frozen Veg Momos', category: 'Momos', quantity: 500, unit: 'pcs', minStock: 200 },
  { id: 8, name: 'Frozen Chicken Momos', category: 'Momos', quantity: 400, unit: 'pcs', minStock: 150 },
  { id: 9, name: 'Tortilla Wraps', category: 'Wraps', quantity: 100, unit: 'pcs', minStock: 50 },
  { id: 10, name: 'Cooking Oil', category: 'General', quantity: 20, unit: 'Litre', minStock: 10 },
];

// Get all stock
router.get('/', (req, res) => {
  res.json(stockItems);
});

// Get low stock items
router.get('/low', (req, res) => {
  const lowStock = stockItems.filter(item => item.quantity <= item.minStock);
  res.json(lowStock);
});

// Add stock item
router.post('/', (req, res) => {
  const item = { id: Date.now(), ...req.body };
  stockItems.push(item);
  res.status(201).json(item);
});

// Update stock quantity
router.patch('/:id', (req, res) => {
  const item = stockItems.find(s => s.id === parseInt(req.params.id));
  if (!item) return res.status(404).json({ message: 'Stock item not found' });
  
  if (req.body.quantity !== undefined) {
    item.quantity = Math.max(0, req.body.quantity);
  }
  if (req.body.delta !== undefined) {
    item.quantity = Math.max(0, item.quantity + req.body.delta);
  }
  
  res.json(item);
});

// Auto deduct stock (called when order is placed)
router.post('/deduct', (req, res) => {
  const { items } = req.body; // Array of ordered items
  
  // Stock deduction logic based on recipe mapping
  const recipeMap = {
    'Classic Fries': [{ stockId: 1, amount: 0.15 }],
    'Cheese Fries': [{ stockId: 1, amount: 0.15 }, { stockId: 2, amount: 2 }],
    'Chicken Loaded Fries': [{ stockId: 1, amount: 0.15 }, { stockId: 3, amount: 0.05 }, { stockId: 2, amount: 2 }],
    'Mint Mojito': [{ stockId: 4, amount: 0.01 }, { stockId: 5, amount: 0.05 }, { stockId: 6, amount: 0.03 }],
    'Veg Momos (6 pcs)': [{ stockId: 7, amount: 6 }],
    'Chicken Momos (6 pcs)': [{ stockId: 8, amount: 6 }],
  };

  if (items) {
    items.forEach(item => {
      const recipe = recipeMap[item.name];
      if (recipe) {
        recipe.forEach(ingredient => {
          const stockItem = stockItems.find(s => s.id === ingredient.stockId);
          if (stockItem) {
            stockItem.quantity = Math.max(0, stockItem.quantity - (ingredient.amount * item.qty));
          }
        });
      }
    });
  }

  res.json({ message: 'Stock deducted successfully', stock: stockItems });
});

module.exports = router;
