// Vercel Serverless Function - Orders
// Note: Vercel serverless functions are stateless, so in-memory storage won't persist.
// This app uses Firebase directly from the frontend (firebase.js), so these API routes 
// are primarily for reference/fallback. The main data operations happen via Firebase client SDK.

let orders = [];
let orderCounter = 1020;

export default function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    return res.status(200).json(orders);
  }

  if (req.method === 'POST') {
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
    return res.status(201).json(order);
  }

  return res.status(405).json({ message: 'Method not allowed' });
}
