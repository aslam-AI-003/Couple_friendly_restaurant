export default function handler(req, res) {
  res.status(200).json({ status: 'OK', message: 'Couple Friendly Hub API is running on Vercel!' });
}
