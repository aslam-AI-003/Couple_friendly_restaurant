import React from 'react';
import { FiDollarSign, FiShoppingBag, FiCreditCard, FiSmartphone, FiTrendingUp, FiAlertTriangle } from 'react-icons/fi';
import { useOrders } from '../context/OrderContext';
import './Dashboard.css';

const Dashboard = () => {
  const { getTodayOrders, getTodaySales, getTodayCash, getTodayUPI, getTodayCard, getTopSellingItem, getRecentOrders } = useOrders();

  const todayOrders = getTodayOrders();
  const todaySales = getTodaySales();
  const todayCash = getTodayCash();
  const todayUPI = getTodayUPI();
  const todayCard = getTodayCard();
  const topItem = getTopSellingItem();
  const recentOrders = getRecentOrders();

  // Calculate top selling items from orders
  const getTopItems = () => {
    const itemCount = {};
    todayOrders.forEach(order => {
      order.items.forEach(item => {
        if (!itemCount[item.name]) {
          itemCount[item.name] = { name: item.name, orders: 0, revenue: 0 };
        }
        itemCount[item.name].orders += item.qty;
        itemCount[item.name].revenue += item.price * item.qty;
      });
    });
    return Object.values(itemCount).sort((a, b) => b.orders - a.orders).slice(0, 5);
  };

  const topItems = getTopItems();

  const stats = [
    { 
      title: "Today's Sales", 
      value: `₹${todaySales.toLocaleString('en-IN')}`, 
      icon: <FiDollarSign />, 
      color: '#e91e63',
      bg: 'linear-gradient(135deg, #e91e63, #ff6090)'
    },
    { 
      title: "Today's Orders", 
      value: todayOrders.length.toString(), 
      icon: <FiShoppingBag />, 
      color: '#9c27b0',
      bg: 'linear-gradient(135deg, #9c27b0, #ba68c8)'
    },
    { 
      title: 'Cash Collection', 
      value: `₹${todayCash.toLocaleString('en-IN')}`, 
      icon: <FiCreditCard />, 
      color: '#4caf50',
      bg: 'linear-gradient(135deg, #4caf50, #66bb6a)'
    },
    { 
      title: 'UPI Collection', 
      value: `₹${todayUPI.toLocaleString('en-IN')}`, 
      icon: <FiSmartphone />, 
      color: '#2196f3',
      bg: 'linear-gradient(135deg, #2196f3, #64b5f6)'
    },
  ];

  const lowStockItems = [];

  // Format time ago
  const timeAgo = (dateStr) => {
    const now = new Date();
    const date = new Date(dateStr);
    const diff = Math.floor((now - date) / 1000 / 60);
    if (diff < 1) return 'Just now';
    if (diff < 60) return `${diff} min ago`;
    return `${Math.floor(diff / 60)} hr ago`;
  };

  return (
    <div className="dashboard">
      <div className="page-header">
        <h1>Dashboard</h1>
        <p>Welcome back! Here's what's happening today.</p>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div className="stat-card" key={index}>
            <div className="stat-icon" style={{ background: stat.bg }}>
              {stat.icon}
            </div>
            <div className="stat-info">
              <h3>{stat.value}</h3>
              <p>{stat.title}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard-grid">
        {/* Top Selling Items */}
        <div className="card dashboard-card">
          <div className="card-header">
            <h2><FiTrendingUp /> Top Selling Items</h2>
            <span className="badge badge-success">Today</span>
          </div>
          <div className="top-items-list">
            {topItems.length > 0 ? topItems.map((item, index) => (
              <div className="top-item" key={index}>
                <div className="top-item-rank">#{index + 1}</div>
                <div className="top-item-info">
                  <h4>{item.name}</h4>
                  <p>{item.orders} orders</p>
                </div>
                <div className="top-item-revenue">₹{item.revenue.toLocaleString('en-IN')}</div>
              </div>
            )) : (
              <div className="empty-state">
                <p>No orders yet today. Create a bill to see data here.</p>
              </div>
            )}
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="card dashboard-card">
          <div className="card-header">
            <h2><FiAlertTriangle /> Low Stock Alerts</h2>
            <span className="badge badge-danger">{lowStockItems.length} Items</span>
          </div>
          <div className="stock-alerts">
            {lowStockItems.map((item, index) => (
              <div className="stock-alert-item" key={index}>
                <div className="stock-alert-info">
                  <h4>{item.name}</h4>
                  <p>Min: {item.min}</p>
                </div>
                <div className="stock-alert-value">
                  <span className="badge badge-danger">{item.current}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Orders */}
        <div className="card dashboard-card full-width">
          <div className="card-header">
            <h2><FiShoppingBag /> Recent Orders</h2>
            <span className="badge badge-success">{recentOrders.length} orders</span>
          </div>
          <div className="orders-table">
            {recentOrders.length > 0 ? (
              <table>
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Items</th>
                    <th>Total</th>
                    <th>Payment</th>
                    <th>Time</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order, index) => (
                    <tr key={index}>
                      <td><strong>{order.billNo}</strong></td>
                      <td>{order.customerName}</td>
                      <td>{order.items.length} items</td>
                      <td><strong>₹{order.total}</strong></td>
                      <td>
                        <span className={`badge ${order.paymentMethod === 'UPI' ? 'badge-success' : order.paymentMethod === 'Card' ? 'badge-warning' : 'badge-veg'}`}>
                          {order.paymentMethod}
                        </span>
                      </td>
                      <td>{timeAgo(order.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="empty-state">
                <p>No orders yet. Go to Billing to create your first order!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
