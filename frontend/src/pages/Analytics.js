import React from 'react';
import { FiTrendingUp, FiTrendingDown, FiClock, FiAward, FiTarget, FiShoppingBag, FiDollarSign, FiPieChart } from 'react-icons/fi';
import { useOrders } from '../context/OrderContext';
import menuItems from '../data/menuItems';
import './Analytics.css';

const Analytics = () => {
  const { orders } = useOrders();

  // Helper to get order date
  const getOrderDate = (order) => {
    const dateField = order.timestamp || order.createdAt;
    if (!dateField) return null;
    const d = new Date(dateField);
    return isNaN(d.getTime()) ? null : d;
  };

  // Calculate top selling from actual orders
  const itemSalesMap = {};
  orders.forEach(order => {
    (order.items || []).forEach(item => {
      if (!itemSalesMap[item.name]) {
        itemSalesMap[item.name] = { name: item.name, orders: 0, revenue: 0 };
      }
      itemSalesMap[item.name].orders += item.qty;
      itemSalesMap[item.name].revenue += item.price * item.qty;
    });
  });

  const sortedByOrders = Object.values(itemSalesMap).sort((a, b) => b.orders - a.orders);
  const hasRealData = sortedByOrders.length > 0;

  // Revenue calculations
  const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const totalOrders = orders.length;
  const avgOrderValue = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;
  const totalItemsSold = Object.values(itemSalesMap).reduce((s, i) => s + i.orders, 0);

  // Today vs Yesterday comparison
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
  const todayOrders = orders.filter(o => { const d = getOrderDate(o); return d && d.toISOString().split('T')[0] === today; });
  const yesterdayOrders = orders.filter(o => { const d = getOrderDate(o); return d && d.toISOString().split('T')[0] === yesterday; });
  const todayRevenue = todayOrders.reduce((s, o) => s + (o.total || 0), 0);
  const yesterdayRevenue = yesterdayOrders.reduce((s, o) => s + (o.total || 0), 0);
  const revenueChange = yesterdayRevenue > 0 ? Math.round((todayRevenue - yesterdayRevenue) / yesterdayRevenue * 100) : 0;

  // This week vs last week
  const thisWeekStart = new Date(); thisWeekStart.setDate(thisWeekStart.getDate() - thisWeekStart.getDay());
  const lastWeekStart = new Date(thisWeekStart); lastWeekStart.setDate(lastWeekStart.getDate() - 7);
  const thisWeekOrders = orders.filter(o => { const d = getOrderDate(o); return d && d >= thisWeekStart; });
  const lastWeekOrders = orders.filter(o => { const d = getOrderDate(o); return d && d >= lastWeekStart && d < thisWeekStart; });
  const thisWeekRev = thisWeekOrders.reduce((s, o) => s + (o.total || 0), 0);
  const lastWeekRev = lastWeekOrders.reduce((s, o) => s + (o.total || 0), 0);
  const weekChange = lastWeekRev > 0 ? Math.round((thisWeekRev - lastWeekRev) / lastWeekRev * 100) : 0;

  // Category breakdown
  const categoryMap = {};
  orders.forEach(order => {
    (order.items || []).forEach(item => {
      // Find category from menuItems
      const menuItem = menuItems.find(m => m.name === item.name);
      const cat = menuItem ? menuItem.category : 'Other';
      if (!categoryMap[cat]) categoryMap[cat] = { name: cat, orders: 0, revenue: 0 };
      categoryMap[cat].orders += item.qty;
      categoryMap[cat].revenue += item.price * item.qty;
    });
  });
  const categoryData = Object.values(categoryMap).sort((a, b) => b.revenue - a.revenue);
  const categoryColors = ['#e91e63', '#9c27b0', '#2196f3', '#4caf50', '#ff9800', '#00bcd4', '#f44336', '#3f51b5'];

  // Peak hours
  const hourCounts = {};
  orders.forEach(order => {
    const d = getOrderDate(order);
    if (d) {
      const hour = d.getHours();
      hourCounts[hour] = (hourCounts[hour] || 0) + 1;
    }
  });

  // Get item image from menu
  const getItemImage = (name) => {
    const item = menuItems.find(m => m.name === name);
    return item ? item.image : 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100';
  };

  // Top selling items
  const topSelling = hasRealData
    ? sortedByOrders.slice(0, 6).map((item, idx) => ({
        rank: idx + 1, name: item.name, orders: item.orders,
        revenue: item.revenue, image: getItemImage(item.name),
        percentage: Math.round(item.orders / totalItemsSold * 100)
      }))
    : [
        { rank: 1, name: 'Chicken Loaded Fries', orders: 456, revenue: 63384, image: getItemImage('Chicken Loaded Fries'), percentage: 25 },
        { rank: 2, name: 'Mint Mojito', orders: 389, revenue: 22951, image: getItemImage('Mint Mojito'), percentage: 21 },
        { rank: 3, name: 'Veg Momos (Steamed/Fried)', orders: 320, revenue: 28480, image: getItemImage('Veg Momos (Steamed/Fried)'), percentage: 17 },
        { rank: 4, name: 'Cheese Loaded Fries', orders: 298, revenue: 29502, image: getItemImage('Cheese Loaded Fries'), percentage: 16 },
        { rank: 5, name: 'Spicy Chicken Wrap', orders: 267, revenue: 39783, image: getItemImage('Spicy Chicken Wrap'), percentage: 14 },
        { rank: 6, name: 'Blue Lagoon Mojito', orders: 234, revenue: 16146, image: getItemImage('Blue Lagoon Mojito'), percentage: 12 },
      ];

  // Least selling
  const leastSelling = hasRealData
    ? sortedByOrders.slice(-4).reverse().map(item => ({ name: item.name, orders: item.orders, image: getItemImage(item.name) }))
    : [
        { name: 'Cold Coffee', orders: 23, image: getItemImage('Cold Coffee') },
        { name: 'Egg Lollipop', orders: 31, image: getItemImage('Egg Lollipop') },
      ];

  // Hourly heatmap data (24 hours)
  const heatmapData = Array.from({length: 24}, (_, i) => ({
    hour: i,
    label: i === 0 ? '12AM' : i < 12 ? `${i}AM` : i === 12 ? '12PM' : `${i-12}PM`,
    count: hourCounts[i] || 0
  }));
  const maxHourCount = Math.max(...heatmapData.map(h => h.count), 1);

  // Revenue last 7 days for mini chart
  const last7Days = Array.from({length: 7}, (_, i) => {
    const date = new Date(); date.setDate(date.getDate() - (6 - i));
    const dateStr = date.toISOString().split('T')[0];
    const dayOrders = orders.filter(o => { const d = getOrderDate(o); return d && d.toISOString().split('T')[0] === dateStr; });
    return { day: date.toLocaleDateString('en-IN', {weekday: 'short'}), revenue: dayOrders.reduce((s, o) => s + (o.total || 0), 0) };
  });
  const maxDayRevenue = Math.max(...last7Days.map(d => d.revenue), 1);

  return (
    <div className="analytics-redesign">
      <div className="page-header">
        <h1>Analytics</h1>
        <p>Business insights & performance {hasRealData ? '(Live Data)' : '(Sample Data)'}</p>
      </div>

      {/* KPI Cards */}
      <div className="kpi-cards">
        <div className="kpi-card gradient-pink">
          <div className="kpi-icon"><FiDollarSign /></div>
          <div className="kpi-info">
            <p className="kpi-label">Total Revenue</p>
            <h3 className="kpi-value">₹{hasRealData ? totalRevenue.toLocaleString('en-IN') : '4,25,000'}</h3>
            {revenueChange !== 0 && <span className={`kpi-change ${revenueChange >= 0 ? 'up' : 'down'}`}>{revenueChange >= 0 ? '↑' : '↓'} {Math.abs(revenueChange)}% vs yesterday</span>}
          </div>
        </div>
        <div className="kpi-card gradient-purple">
          <div className="kpi-icon"><FiShoppingBag /></div>
          <div className="kpi-info">
            <p className="kpi-label">Total Orders</p>
            <h3 className="kpi-value">{hasRealData ? totalOrders : '3,820'}</h3>
            <span className="kpi-sub">Today: {todayOrders.length}</span>
          </div>
        </div>
        <div className="kpi-card gradient-blue">
          <div className="kpi-icon"><FiTarget /></div>
          <div className="kpi-info">
            <p className="kpi-label">Avg Order Value</p>
            <h3 className="kpi-value">₹{hasRealData ? avgOrderValue : '111'}</h3>
            <span className="kpi-sub">{totalItemsSold || 0} items sold</span>
          </div>
        </div>
        <div className="kpi-card gradient-green">
          <div className="kpi-icon"><FiAward /></div>
          <div className="kpi-info">
            <p className="kpi-label">Best Seller</p>
            <h3 className="kpi-value" style={{fontSize: '16px'}}>{topSelling[0]?.name || 'N/A'}</h3>
            <span className="kpi-sub">{topSelling[0]?.orders || 0} orders</span>
          </div>
        </div>
      </div>

      {/* Revenue Chart + Comparison */}
      <div className="analytics-row">
        <div className="chart-card">
          <h3>📈 Revenue Trend (Last 7 Days)</h3>
          <div className="mini-chart">
            {last7Days.map((day, idx) => (
              <div className="mini-bar-wrap" key={idx}>
                <div className="mini-bar" style={{height: `${(day.revenue / maxDayRevenue) * 100}%`}}>
                  {day.revenue > 0 && <span className="mini-bar-val">₹{day.revenue >= 1000 ? Math.round(day.revenue/1000) + 'k' : day.revenue}</span>}
                </div>
                <span className="mini-bar-label">{day.day}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="comparison-card">
          <h3>📊 Comparison</h3>
          <div className="compare-items">
            <div className="compare-item">
              <span className="compare-label">Today vs Yesterday</span>
              <div className="compare-values">
                <span className="compare-main">₹{todayRevenue.toLocaleString('en-IN')}</span>
                <span className={`compare-change ${revenueChange >= 0 ? 'up' : 'down'}`}>
                  {revenueChange >= 0 ? '↑' : '↓'} {Math.abs(revenueChange)}%
                </span>
              </div>
            </div>
            <div className="compare-item">
              <span className="compare-label">This Week vs Last Week</span>
              <div className="compare-values">
                <span className="compare-main">₹{thisWeekRev.toLocaleString('en-IN')}</span>
                <span className={`compare-change ${weekChange >= 0 ? 'up' : 'down'}`}>
                  {weekChange >= 0 ? '↑' : '↓'} {Math.abs(weekChange)}%
                </span>
              </div>
            </div>
            <div className="compare-item">
              <span className="compare-label">Today's Orders</span>
              <div className="compare-values">
                <span className="compare-main">{todayOrders.length} orders</span>
                <span className="compare-sub">₹{todayRevenue.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Top Selling Cards */}
      <div className="section-header">
        <h2><FiTrendingUp /> Top Selling Items</h2>
        <span className="live-badge">{hasRealData ? '🟢 Live' : '⚪ Sample'}</span>
      </div>
      <div className="top-selling-grid">
        {topSelling.map(item => (
          <div className="top-item-card" key={item.rank}>
            <div className="top-item-rank">
              {item.rank <= 3 ? ['🥇','🥈','🥉'][item.rank-1] : `#${item.rank}`}
            </div>
            <img src={item.image} alt={item.name} className="top-item-img" onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100'; }} />
            <div className="top-item-info">
              <h4>{item.name}</h4>
              <p>{item.orders} orders • ₹{item.revenue.toLocaleString('en-IN')}</p>
              <div className="top-item-bar">
                <div className="top-item-fill" style={{width: `${item.percentage}%`}}></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Category Donut + Least Selling + Heatmap */}
      <div className="analytics-row-3">
        {/* Category Breakdown */}
        <div className="category-card">
          <h3><FiPieChart /> Category Breakdown</h3>
          {categoryData.length > 0 ? (
            <div className="category-content">
              <div className="donut-chart">
                <svg viewBox="0 0 200 200">
                  {(() => {
                    const totalCatRev = categoryData.reduce((s, c) => s + c.revenue, 0);
                    let currentAngle = 0;
                    return categoryData.map((cat, idx) => {
                      const percentage = cat.revenue / totalCatRev;
                      const angle = percentage * 360;
                      const startAngle = currentAngle;
                      currentAngle += angle;
                      const x1 = 100 + 80 * Math.cos((startAngle - 90) * Math.PI / 180);
                      const y1 = 100 + 80 * Math.sin((startAngle - 90) * Math.PI / 180);
                      const x2 = 100 + 80 * Math.cos((startAngle + angle - 90) * Math.PI / 180);
                      const y2 = 100 + 80 * Math.sin((startAngle + angle - 90) * Math.PI / 180);
                      const largeArc = angle > 180 ? 1 : 0;
                      return (
                        <path key={idx}
                          d={`M 100 100 L ${x1} ${y1} A 80 80 0 ${largeArc} 1 ${x2} ${y2} Z`}
                          fill={categoryColors[idx % categoryColors.length]}
                          opacity="0.85"
                        />
                      );
                    });
                  })()}
                  <circle cx="100" cy="100" r="45" fill="white" />
                  <text x="100" y="95" textAnchor="middle" fontSize="12" fill="#666">Revenue</text>
                  <text x="100" y="115" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#1a1a2e">₹{totalRevenue >= 1000 ? Math.round(totalRevenue/1000) + 'k' : totalRevenue}</text>
                </svg>
              </div>
              <div className="category-legend">
                {categoryData.slice(0, 6).map((cat, idx) => (
                  <div className="legend-item" key={cat.name}>
                    <span className="legend-dot" style={{background: categoryColors[idx % categoryColors.length]}}></span>
                    <span className="legend-name">{cat.name}</span>
                    <span className="legend-value">₹{cat.revenue.toLocaleString('en-IN')}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="no-data-text">Start billing to see category breakdown</p>
          )}
        </div>

        {/* Least Selling */}
        <div className="least-card">
          <h3><FiTrendingDown /> Needs Attention</h3>
          <div className="least-list">
            {leastSelling.map((item, idx) => (
              <div className="least-item-new" key={idx}>
                <img src={item.image} alt={item.name} className="least-img" onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=60'; }} />
                <div className="least-info">
                  <h4>{item.name}</h4>
                  <p>Only {item.orders} orders</p>
                </div>
                <span className="least-badge">Low</span>
              </div>
            ))}
          </div>
        </div>

        {/* Hourly Heatmap */}
        <div className="heatmap-card">
          <h3><FiClock /> Sales Heatmap (24hr)</h3>
          <div className="heatmap-grid">
            {heatmapData.filter(h => h.hour >= 8 && h.hour <= 22).map(h => (
              <div className="heatmap-cell" key={h.hour}
                style={{background: h.count > 0 ? `rgba(233, 30, 99, ${Math.max(0.15, h.count / maxHourCount)})` : '#f5f5f5'}}
                title={`${h.label}: ${h.count} orders`}>
                <span className="heatmap-label">{h.label}</span>
                <span className="heatmap-count">{h.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Insights */}
      <div className="insights-section-new">
        <h2><FiTarget /> AI Insights</h2>
        <div className="insights-scroll">
          {hasRealData ? (
            <>
              <div className="insight-pill">🔥 {topSelling[0]?.name} is your #1 seller!</div>
              <div className="insight-pill">📈 Revenue: ₹{totalRevenue.toLocaleString('en-IN')} from {totalOrders} orders</div>
              <div className="insight-pill">💡 Avg Order: ₹{avgOrderValue}</div>
              {leastSelling[0] && <div className="insight-pill">⚠️ {leastSelling[0].name} needs promotion</div>}
              <div className="insight-pill">🎯 Push combo deals for higher AOV!</div>
              <div className="insight-pill">⚡ Peak hours: staff up during rush time</div>
            </>
          ) : (
            <>
              <div className="insight-pill">🔥 Start billing to see real insights</div>
              <div className="insight-pill">📊 Analytics will populate automatically</div>
              <div className="insight-pill">💡 AI suggestions based on your data</div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Analytics;
