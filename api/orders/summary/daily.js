export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const summary = {
    totalOrders: 0,
    totalSales: 0,
    cashCollection: 0,
    upiCollection: 0,
    cardCollection: 0,
  };

  return res.status(200).json(summary);
}
