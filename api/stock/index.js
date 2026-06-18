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

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    return res.status(200).json(stockItems);
  }

  if (req.method === 'POST') {
    const item = { id: Date.now(), ...req.body };
    stockItems.push(item);
    return res.status(201).json(item);
  }

  return res.status(405).json({ message: 'Method not allowed' });
}
