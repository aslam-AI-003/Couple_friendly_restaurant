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

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    return res.status(200).json(products);
  }

  if (req.method === 'POST') {
    const product = { id: `custom-${Date.now()}`, ...req.body, isAvailable: true };
    products.push(product);
    return res.status(201).json(product);
  }

  return res.status(405).json({ message: 'Method not allowed' });
}
