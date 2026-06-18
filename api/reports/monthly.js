export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  return res.status(200).json({
    month: 'June 2026',
    revenue: 425000,
    orders: 3820,
    avgBill: 111,
    growth: '+12%',
    bestDay: 'Saturday',
    cashPercent: 32,
    upiPercent: 68
  });
}
