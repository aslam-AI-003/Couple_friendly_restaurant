export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  return res.status(200).json({
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
}
