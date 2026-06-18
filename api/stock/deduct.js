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

const recipeMap = {
  'Classic Fries': [{ stockId: 1, amount: 0.15 }],
  'Cheese Fries': [{ stockId: 1, amount: 0.15 }, { stockId: 2, amount: 2 }],
  'Chicken Loaded Fries': [{ stockId: 1, amount: 0.15 }, { stockId: 3, amount: 0.05 }, { stockId: 2, amount: 2 }],
  'Mint Mojito': [{ stockId: 4, amount: 0.01 }, { stockId: 5, amount: 0.05 }, { stockId: 6, amount: 0.03 }],
  'Veg Momos (6 pcs)': [{ stockId: 7, amount: 6 }],
  'Chicken Momos (6 pcs)': [{ stockId: 8, amount: 6 }],
};

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { items } = req.body;

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

  return res.status(200).json({ message: 'Stock deducted successfully', stock: stockItems });
}
