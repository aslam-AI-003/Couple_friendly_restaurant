# 💕 Couple Friendly Hub - POS & Billing System

A complete Restaurant POS (Point of Sale) and Billing Web Application for **Couple Friendly Hub**.

## 🚀 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React.js with responsive UI |
| **Backend** | Node.js + Express |
| **Database** | Firebase Firestore |
| **Authentication** | Firebase Auth |
| **Printing** | Thermal Printer (58mm/80mm) |
| **Notifications** | WhatsApp & SMS API |

## 📁 Project Structure

```
couple-friendly/
├── frontend/              # React.js Frontend
│   ├── public/
│   ├── src/
│   │   ├── components/    # Reusable components (Sidebar)
│   │   ├── pages/         # All pages (Dashboard, Billing, etc.)
│   │   ├── data/          # Menu items data
│   │   ├── firebase.js    # Firebase config
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
├── backend/               # Node.js Backend
│   ├── routes/            # API routes
│   │   ├── orders.js
│   │   ├── products.js
│   │   ├── reports.js
│   │   └── stock.js
│   ├── server.js
│   ├── .env
│   └── package.json
└── README.md
```

## 🎯 Modules

1. **Dashboard** - Today's sales, orders, cash/UPI collection, top items, low stock alerts
2. **Customer Billing** - Menu selection, cart, payment, bill generation
3. **Payment Screen** - Cash / UPI / Card options
4. **Bill Printing** - Thermal printer output + PDF + WhatsApp
5. **Menu Management** - Add/Edit/Delete/Hide menu items
6. **Stock Management** - Raw material tracking, auto-deduction
7. **Daily/Weekly/Monthly Reports** - Sales analytics
8. **Analytics** - Top selling, least selling, peak hours, AI insights

## 🛠️ Setup Instructions

### 1. Install Dependencies

```bash
# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install
```

### 2. Configure Firebase

Update `frontend/src/firebase.js` with your Firebase project credentials.

### 3. Run the Application

```bash
# Start frontend (port 3000)
cd frontend
npm start

# Start backend (port 5000)
cd backend
npm run dev
```

## 📱 Features

- ✅ Responsive UI (Laptop + Tablet + Mobile)
- ✅ Beautiful gradient-based classy design
- ✅ Menu items with images
- ✅ Category-wise menu filtering
- ✅ Cart management with quantity controls
- ✅ Payment method selection (Cash/UPI/Card)
- ✅ Bill generation with receipt preview
- ✅ Print & WhatsApp bill sharing
- ✅ Stock auto-deduction on order
- ✅ Low stock alerts
- ✅ Daily, Weekly, Monthly reports
- ✅ AI-powered analytics & insights
- ✅ Admin & Staff role-based login
- ✅ GST calculation support

## 🍟 Menu Categories

- Loaded Fries (Classic, Cheese, Veg, Chicken, Peri Peri)
- Wraps (Paneer, Chicken, Egg, Veg)
- Momos (Steamed, Fried, Tandoori - Veg & Non-Veg)
- Mojito & Drinks (Mint, Blue Lagoon, Strawberry, Green Apple, Cold Coffee, Shakes)
- Starters (Egg Lollipop, Chicken Lollipop, Paneer 65, Chicken 65)
- Combos (Couple Combo 1 & 2, Friends Combo, Party Combo)
- Sandwiches (Veg, Chicken, Club)
- Burgers (Veg, Chicken, Double Chicken)

## 🔮 Future Upgrades

- Kitchen Display System (KDS)
- QR Code Table Ordering
- AI Stock Prediction
- Multi-branch Support
- SaaS Model for other restaurants

## 💰 Budget Estimate

- **MVP Version**: ₹20,000 – ₹40,000
- **Professional Version**: ₹75,000 – ₹1.5 Lakhs

---

Made with ❤️ for Couple Friendly Hub
