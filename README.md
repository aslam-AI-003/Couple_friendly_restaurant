# Couple Friendly Hub - POS & Billing System 🍽️

A complete Point of Sale (POS) and billing system for Couple Friendly restaurant, built with React and Firebase, deployed on **Vercel**.

## 🚀 Features

- **Dashboard** - Real-time overview of sales, orders, and analytics
- **Billing** - Fast billing with menu items, GST calculation, and payment options
- **Menu Management** - Add, edit, toggle availability of menu items
- **Stock Management** - Track inventory with auto-deduction and low-stock alerts
- **Reports** - Daily, weekly, and monthly reports
- **Analytics** - Charts and insights on sales performance
- **Expenses** - Track business expenses

## 🏗️ Tech Stack

- **Frontend**: React 18, React Router, Recharts, React Icons
- **Backend**: Vercel Serverless Functions (API routes in `/api`)
- **Database**: Firebase Firestore (real-time sync)
- **Deployment**: Vercel
- **PDF Generation**: jsPDF + html2canvas

## 📁 Project Structure

```
├── api/                    # Vercel Serverless API Functions
│   ├── health.js
│   ├── orders/
│   │   ├── index.js
│   │   ├── today.js
│   │   └── summary/daily.js
│   ├── products/
│   │   └── index.js
│   ├── reports/
│   │   ├── daily.js
│   │   ├── weekly.js
│   │   └── monthly.js
│   └── stock/
│       ├── index.js
│       ├── low.js
│       └── deduct.js
├── frontend/               # React Frontend App
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── data/
│   │   ├── pages/
│   │   ├── firebase.js
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
├── backend/                # Legacy Express Backend (for local dev)
├── vercel.json             # Vercel Configuration
├── package.json
└── README.md
```

## 🚀 Deploying to Vercel

### Option 1: Deploy via GitHub (Recommended)

1. **Push your code to GitHub**:
   ```bash
   git add .
   git commit -m "Migrate to Vercel deployment"
   git push origin main
   ```

2. **Go to [vercel.com](https://vercel.com)** and sign up/log in

3. **Import your GitHub repository**:
   - Click "Add New" → "Project"
   - Select your `Couple_friendly_restaurant` repository
   - Vercel will auto-detect the configuration from `vercel.json`

4. **Deploy** - Click "Deploy" and Vercel will:
   - Build the React frontend from `/frontend`
   - Deploy serverless API functions from `/api`
   - Set up routing automatically

### Option 2: Deploy via Vercel CLI

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy**:
   ```bash
   vercel
   ```

4. **Deploy to production**:
   ```bash
   vercel --prod
   ```

## 🔧 Local Development

### Run Frontend:
```bash
cd frontend
npm install
npm start
```

### Run Backend (Express - for local dev):
```bash
cd backend
npm install
npm run dev
```

### Run Both (Concurrently):
```bash
npm run install:all
npm run dev
```

## 🌐 API Endpoints (Vercel Serverless)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/health` | GET | Health check |
| `/api/orders` | GET, POST | List/Create orders |
| `/api/orders/today` | GET | Today's orders |
| `/api/orders/summary/daily` | GET | Daily summary |
| `/api/products` | GET, POST | List/Add products |
| `/api/reports/daily` | GET | Daily report |
| `/api/reports/weekly` | GET | Weekly report |
| `/api/reports/monthly` | GET | Monthly report |
| `/api/stock` | GET, POST | List/Add stock |
| `/api/stock/low` | GET | Low stock alerts |
| `/api/stock/deduct` | POST | Deduct stock |

## 🔥 Firebase Configuration

The app uses Firebase Firestore for real-time data. The Firebase configuration is in `frontend/src/firebase.js`. 

> **Note**: The main data operations (orders, products, stock) happen directly via the Firebase client SDK in the frontend. The `/api` serverless functions serve as optional API endpoints.

## 📝 Environment Variables (Optional)

If you want to use environment variables for Firebase config on Vercel:

1. Go to your Vercel project → Settings → Environment Variables
2. Add your Firebase config values:
   - `REACT_APP_FIREBASE_API_KEY`
   - `REACT_APP_FIREBASE_AUTH_DOMAIN`
   - `REACT_APP_FIREBASE_PROJECT_ID`
   - `REACT_APP_FIREBASE_STORAGE_BUCKET`
   - `REACT_APP_FIREBASE_MESSAGING_SENDER_ID`
   - `REACT_APP_FIREBASE_APP_ID`

## 📱 Mobile Responsive

The app is fully responsive with a collapsible sidebar for mobile devices.

## 🎯 Migration from Netlify to Vercel

This project was migrated from Netlify to Vercel. Key changes:
- Replaced `netlify.toml` with `vercel.json`
- Converted Express backend routes to Vercel serverless functions (`/api` directory)
- Removed `_redirects` file (Vercel handles rewrites via `vercel.json`)
- SPA routing is configured via `rewrites` in `vercel.json`
