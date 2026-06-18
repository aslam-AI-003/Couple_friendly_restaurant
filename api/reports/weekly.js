export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  return res.status(200).json({
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
}
