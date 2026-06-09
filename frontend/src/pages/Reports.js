import React, { useState } from 'react';
import { FiCalendar, FiDownload, FiTrendingUp, FiShoppingBag, FiClock } from 'react-icons/fi';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { useOrders } from '../context/OrderContext';
import './Reports.css';

const Reports = () => {
  const { orders } = useOrders();
  const [reportType, setReportType] = useState('daily');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  // Helper: get today's date string
  const today = new Date().toISOString().split('T')[0];

  // Helper to get order date (supports both timestamp and createdAt fields)
  const getOrderDate = (order) => {
    const dateField = order.timestamp || order.createdAt;
    if (!dateField) return null;
    const d = new Date(dateField);
    return isNaN(d.getTime()) ? null : d;
  };

  // Filter orders by date
  const getOrdersForDate = (dateStr) => {
    return orders.filter(o => {
      const d = getOrderDate(o);
      if (!d) return false;
      return d.toISOString().split('T')[0] === dateStr;
    });
  };

  // Filter orders for this week (last 7 days)
  const getWeeklyOrders = () => {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    return orders.filter(o => {
      const d = getOrderDate(o);
      if (!d) return false;
      return d >= weekAgo;
    });
  };

  // Filter orders for this month
  const getMonthlyOrders = () => {
    const currentMonth = new Date().toISOString().slice(0, 7);
    return orders.filter(o => {
      const d = getOrderDate(o);
      if (!d) return false;
      return d.toISOString().slice(0, 7) === currentMonth;
    });
  };

  // Calculate stats from orders
  const calcStats = (orderList) => {
    const totalOrders = orderList.length;
    const totalSales = orderList.reduce((sum, o) => sum + (o.total || 0), 0);
    const cashOrders = orderList.filter(o => o.paymentMethod === 'Cash');
    const upiOrders = orderList.filter(o => o.paymentMethod === 'UPI');
    const cardOrders = orderList.filter(o => o.paymentMethod === 'Card');
    const cash = cashOrders.reduce((sum, o) => sum + (o.total || 0), 0);
    const upi = upiOrders.reduce((sum, o) => sum + (o.total || 0), 0);
    const card = cardOrders.reduce((sum, o) => sum + (o.total || 0), 0);
    const avgBill = totalOrders > 0 ? Math.round(totalSales / totalOrders) : 0;

    // Top item
    const itemMap = {};
    orderList.forEach(o => {
      (o.items || []).forEach(item => {
        itemMap[item.name] = (itemMap[item.name] || 0) + item.qty;
      });
    });
    const topItem = Object.entries(itemMap).sort((a, b) => b[1] - a[1])[0];

    // Peak hour
    const hourMap = {};
    orderList.forEach(o => {
      const d = getOrderDate(o);
      if (d) {
        const hour = d.getHours();
        hourMap[hour] = (hourMap[hour] || 0) + 1;
      }
    });
    const peakHourEntry = Object.entries(hourMap).sort((a, b) => b[1] - a[1])[0];
    const peakHour = peakHourEntry ? `${peakHourEntry[0]}:00 - ${Number(peakHourEntry[0]) + 1}:00` : 'N/A';

    return { totalOrders, totalSales, cash, upi, card, avgBill, topItem: topItem ? topItem[0] : 'N/A', peakHour };
  };

  // Daily data
  const dailyOrders = getOrdersForDate(selectedDate);
  const dailyStats = calcStats(dailyOrders);
  const hasLiveData = orders.length > 0;

  // Weekly data - last 7 days
  const getWeeklyBreakdown = () => {
    const days = [];
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const dayOrders = getOrdersForDate(dateStr);
      days.push({
        day: dayNames[date.getDay()],
        date: dateStr,
        orders: dayOrders.length,
        sales: dayOrders.reduce((sum, o) => sum + (o.total || 0), 0)
      });
    }
    return days;
  };

  const weeklyBreakdown = getWeeklyBreakdown();
  const weeklyOrders = getWeeklyOrders();
  const weeklyStats = calcStats(weeklyOrders);

  // Monthly data
  const monthlyOrders = getMonthlyOrders();
  const monthlyStats = calcStats(monthlyOrders);

  // Recent orders for order history
  const recentOrders = [...orders].sort((a, b) => {
    const dateA = getOrderDate(a);
    const dateB = getOrderDate(b);
    return (dateB || 0) - (dateA || 0);
  }).slice(0, 10);

  // Category-wise sales
  const getCategorySales = (orderList) => {
    const catMap = {};
    orderList.forEach(o => {
      (o.items || []).forEach(item => {
        const cat = item.category || 'Other';
        if (!catMap[cat]) catMap[cat] = { orders: 0, revenue: 0 };
        catMap[cat].orders += item.qty;
        catMap[cat].revenue += item.price * item.qty;
      });
    });
    return Object.entries(catMap).map(([name, data]) => ({ name, ...data })).sort((a, b) => b.revenue - a.revenue);
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    
    doc.setFontSize(20);
    doc.setTextColor(233, 30, 99);
    doc.text('Couple Friendly Hub', 105, 20, { align: 'center' });
    doc.setFontSize(12);
    doc.setTextColor(100);
    doc.text('Sales Report', 105, 28, { align: 'center' });
    doc.setDrawColor(233, 30, 99);
    doc.line(20, 32, 190, 32);

    if (reportType === 'daily') {
      doc.setFontSize(14);
      doc.setTextColor(0);
      doc.text('Daily Report - ' + new Date(selectedDate).toLocaleDateString('en-IN', {day: '2-digit', month: 'short', year: 'numeric'}), 20, 42);
      
      autoTable(doc, {
        startY: 50,
        head: [['Metric', 'Value']],
        body: [
          ['Total Orders', dailyStats.totalOrders.toString()],
          ['Total Sales', 'Rs.' + dailyStats.totalSales.toLocaleString('en-IN')],
          ['Cash Collection', 'Rs.' + dailyStats.cash.toLocaleString('en-IN')],
          ['UPI Collection', 'Rs.' + dailyStats.upi.toLocaleString('en-IN')],
          ['Card Collection', 'Rs.' + dailyStats.card.toLocaleString('en-IN')],
          ['Average Bill', 'Rs.' + dailyStats.avgBill],
          ['Peak Hour', dailyStats.peakHour],
          ['Top Selling Item', dailyStats.topItem],
        ],
        theme: 'grid',
        headStyles: { fillColor: [233, 30, 99] },
        styles: { fontSize: 11 },
      });

      // Add order list
      if (dailyOrders.length > 0) {
        const finalY = doc.lastAutoTable.finalY + 15;
        doc.setFontSize(12);
        doc.text('Order Details:', 20, finalY);
        autoTable(doc, {
          startY: finalY + 5,
          head: [['Bill#', 'Customer', 'Items', 'Amount', 'Payment', 'Time']],
          body: dailyOrders.map(o => {
            const d = getOrderDate(o);
            return [
              '#' + o.billNo,
              o.customerName,
              (o.items || []).map(i => i.name).join(', ').substring(0, 30),
              'Rs.' + (o.total || 0),
              o.paymentMethod,
              d ? d.toLocaleTimeString('en-IN', {hour: '2-digit', minute: '2-digit'}) : '-'
            ];
          }),
          theme: 'grid',
          headStyles: { fillColor: [233, 30, 99] },
          styles: { fontSize: 9 },
        });
      }

    } else if (reportType === 'weekly') {
      doc.setFontSize(14);
      doc.setTextColor(0);
      doc.text('Weekly Report - Last 7 Days', 20, 42);

      autoTable(doc, {
        startY: 50,
        head: [['Day', 'Date', 'Orders', 'Sales']],
        body: weeklyBreakdown.map(d => [d.day, d.date, d.orders.toString(), 'Rs.' + d.sales.toLocaleString('en-IN')]),
        theme: 'grid',
        headStyles: { fillColor: [233, 30, 99] },
        styles: { fontSize: 11 },
      });

      const finalY = doc.lastAutoTable.finalY + 10;
      doc.setFontSize(11);
      doc.text('Total Orders: ' + weeklyStats.totalOrders, 20, finalY);
      doc.text('Total Revenue: Rs.' + weeklyStats.totalSales.toLocaleString('en-IN'), 20, finalY + 7);
      doc.text('Average Daily: Rs.' + Math.round(weeklyStats.totalSales / 7).toLocaleString('en-IN'), 20, finalY + 14);

    } else if (reportType === 'monthly') {
      doc.setFontSize(14);
      doc.setTextColor(0);
      const monthName = new Date().toLocaleDateString('en-IN', {month: 'long', year: 'numeric'});
      doc.text('Monthly Report - ' + monthName, 20, 42);

      autoTable(doc, {
        startY: 50,
        head: [['Metric', 'Value']],
        body: [
          ['Total Revenue', 'Rs.' + monthlyStats.totalSales.toLocaleString('en-IN')],
          ['Total Orders', monthlyStats.totalOrders.toString()],
          ['Average Bill', 'Rs.' + monthlyStats.avgBill],
          ['Cash Collection', 'Rs.' + monthlyStats.cash.toLocaleString('en-IN')],
          ['UPI Collection', 'Rs.' + monthlyStats.upi.toLocaleString('en-IN')],
          ['Card Collection', 'Rs.' + monthlyStats.card.toLocaleString('en-IN')],
          ['Top Item', monthlyStats.topItem],
          ['Peak Hour', monthlyStats.peakHour],
        ],
        theme: 'grid',
        headStyles: { fillColor: [233, 30, 99] },
        styles: { fontSize: 11 },
      });
    }

    const pageHeight = doc.internal.pageSize.height;
    doc.setFontSize(9);
    doc.setTextColor(150);
    doc.text('Generated by Couple Friendly Hub POS System', 105, pageHeight - 10, { align: 'center' });
    doc.save('CF_Hub_' + reportType + '_report_' + new Date().toISOString().split('T')[0] + '.pdf');
  };

  return (
    <div className="reports">
      <div className="page-header">
        <div>
          <h1>Sales Reports</h1>
          <p>Track your business performance {hasLiveData ? '(Live Data)' : '(No orders yet - start billing!)'}</p>
        </div>
        <button className="btn btn-primary" onClick={exportPDF}>
          <FiDownload /> Export PDF
        </button>
      </div>

      {/* Report Type Tabs */}
      <div className="report-tabs">
        <button className={`report-tab ${reportType === 'daily' ? 'active' : ''}`} onClick={() => setReportType('daily')}>
          Daily Report
        </button>
        <button className={`report-tab ${reportType === 'weekly' ? 'active' : ''}`} onClick={() => setReportType('weekly')}>
          Weekly Report
        </button>
        <button className={`report-tab ${reportType === 'monthly' ? 'active' : ''}`} onClick={() => setReportType('monthly')}>
          Monthly Report
        </button>
      </div>

      {/* Daily Report */}
      {reportType === 'daily' && (
        <div className="report-content">
          <div className="report-date-card">
            <FiCalendar />
            <input 
              type="date" 
              value={selectedDate} 
              onChange={(e) => setSelectedDate(e.target.value)}
              style={{border: 'none', background: 'transparent', color: '#e91e63', fontWeight: '600', fontSize: '14px', cursor: 'pointer'}}
            />
          </div>

          <div className="report-stats-grid">
            <div className="report-stat">
              <h4>Total Orders</h4>
              <p className="stat-value">{dailyStats.totalOrders}</p>
            </div>
            <div className="report-stat">
              <h4>Total Sales</h4>
              <p className="stat-value">₹{dailyStats.totalSales.toLocaleString('en-IN')}</p>
            </div>
            <div className="report-stat">
              <h4>Cash Collection</h4>
              <p className="stat-value cash">₹{dailyStats.cash.toLocaleString('en-IN')}</p>
            </div>
            <div className="report-stat">
              <h4>UPI Collection</h4>
              <p className="stat-value upi">₹{dailyStats.upi.toLocaleString('en-IN')}</p>
            </div>
            <div className="report-stat">
              <h4>Average Bill</h4>
              <p className="stat-value">₹{dailyStats.avgBill}</p>
            </div>
            <div className="report-stat">
              <h4>Peak Hour</h4>
              <p className="stat-value peak">{dailyStats.peakHour}</p>
            </div>
          </div>

          {dailyStats.topItem !== 'N/A' && (
            <div className="report-highlight">
              <FiTrendingUp />
              <span>Top Selling Item: <strong>{dailyStats.topItem}</strong></span>
            </div>
          )}

          {/* Order History for the day */}
          {dailyOrders.length > 0 && (
            <div className="order-history">
              <h3><FiShoppingBag /> Orders on {new Date(selectedDate).toLocaleDateString('en-IN', {day: '2-digit', month: 'short', year: 'numeric'})}</h3>
              <div className="orders-table-wrapper">
                <table className="orders-table">
                  <thead>
                    <tr>
                      <th>Bill #</th>
                      <th>Customer</th>
                      <th>Items</th>
                      <th>Amount</th>
                      <th>Payment</th>
                      <th>Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dailyOrders.map(order => (
                      <tr key={order.billNo}>
                        <td><strong>#{order.billNo}</strong></td>
                        <td>{order.customerName}</td>
                        <td className="items-cell">{(order.items || []).map(i => `${i.name} x${i.qty}`).join(', ')}</td>
                        <td className="amount-cell">₹{order.total}</td>
                        <td><span className={`payment-badge ${order.paymentMethod.toLowerCase()}`}>{order.paymentMethod}</span></td>
                        <td>{(() => { const d = getOrderDate(order); return d ? d.toLocaleTimeString('en-IN', {hour: '2-digit', minute: '2-digit'}) : '-'; })()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {dailyOrders.length === 0 && (
            <div className="no-data-message">
              <p>📊 No orders found for this date. Start billing to see live reports!</p>
            </div>
          )}
        </div>
      )}

      {/* Weekly Report */}
      {reportType === 'weekly' && (
        <div className="report-content">
          <div className="report-date-card">
            <FiCalendar />
            <span>Last 7 Days</span>
          </div>

          <div className="weekly-chart">
            {weeklyBreakdown.map((day, index) => {
              const maxSales = Math.max(...weeklyBreakdown.map(d => d.sales), 1);
              return (
                <div className="chart-bar-container" key={index}>
                  <div className="chart-bar" style={{ height: `${(day.sales / maxSales) * 100}%` }}>
                    {day.sales > 0 && <span className="chart-value">₹{day.sales >= 1000 ? (day.sales / 1000).toFixed(1) + 'k' : day.sales}</span>}
                  </div>
                  <span className="chart-label">{day.day}</span>
                  <span className="chart-orders">{day.orders} orders</span>
                </div>
              );
            })}
          </div>

          <div className="weekly-summary">
            <div className="summary-item">
              <h4>Total Orders</h4>
              <p>{weeklyStats.totalOrders}</p>
            </div>
            <div className="summary-item">
              <h4>Total Revenue</h4>
              <p>₹{weeklyStats.totalSales.toLocaleString('en-IN')}</p>
            </div>
            <div className="summary-item">
              <h4>Best Day</h4>
              <p>{weeklyBreakdown.reduce((best, d) => d.sales > best.sales ? d : best, weeklyBreakdown[0])?.day || 'N/A'}</p>
            </div>
            <div className="summary-item">
              <h4>Avg Daily</h4>
              <p>₹{weeklyStats.totalOrders > 0 ? Math.round(weeklyStats.totalSales / 7).toLocaleString('en-IN') : '0'}</p>
            </div>
          </div>

          {weeklyStats.totalOrders === 0 && (
            <div className="no-data-message">
              <p>📊 No orders in the last 7 days. Start billing to see weekly trends!</p>
            </div>
          )}
        </div>
      )}

      {/* Monthly Report */}
      {reportType === 'monthly' && (
        <div className="report-content">
          <div className="report-date-card">
            <FiCalendar />
            <span>{new Date().toLocaleDateString('en-IN', {month: 'long', year: 'numeric'})}</span>
          </div>

          <div className="report-stats-grid">
            <div className="report-stat highlight">
              <h4>Total Revenue</h4>
              <p className="stat-value big">₹{monthlyStats.totalSales.toLocaleString('en-IN')}</p>
            </div>
            <div className="report-stat">
              <h4>Total Orders</h4>
              <p className="stat-value">{monthlyStats.totalOrders}</p>
            </div>
            <div className="report-stat">
              <h4>Average Bill</h4>
              <p className="stat-value">₹{monthlyStats.avgBill}</p>
            </div>
            <div className="report-stat">
              <h4>Top Item</h4>
              <p className="stat-value" style={{fontSize: '14px'}}>{monthlyStats.topItem}</p>
            </div>
          </div>

          {monthlyStats.totalSales > 0 && (
            <div className="payment-split">
              <h3>Payment Split</h3>
              <div className="split-bar">
                {monthlyStats.cash > 0 && (
                  <div className="split-segment cash" style={{ width: `${Math.round(monthlyStats.cash / monthlyStats.totalSales * 100)}%` }}>
                    Cash {Math.round(monthlyStats.cash / monthlyStats.totalSales * 100)}%
                  </div>
                )}
                {monthlyStats.upi > 0 && (
                  <div className="split-segment upi" style={{ width: `${Math.round(monthlyStats.upi / monthlyStats.totalSales * 100)}%` }}>
                    UPI {Math.round(monthlyStats.upi / monthlyStats.totalSales * 100)}%
                  </div>
                )}
                {monthlyStats.card > 0 && (
                  <div className="split-segment card" style={{ width: `${Math.round(monthlyStats.card / monthlyStats.totalSales * 100)}%` }}>
                    Card {Math.round(monthlyStats.card / monthlyStats.totalSales * 100)}%
                  </div>
                )}
              </div>
            </div>
          )}

          {monthlyStats.totalOrders === 0 && (
            <div className="no-data-message">
              <p>📊 No orders this month yet. Start billing to see monthly reports!</p>
            </div>
          )}
        </div>
      )}

      {/* Recent Orders (shown at bottom regardless of tab) */}
      {recentOrders.length > 0 && reportType !== 'daily' && (
        <div className="order-history" style={{marginTop: '24px'}}>
          <h3><FiClock /> Recent Orders</h3>
          <div className="orders-table-wrapper">
            <table className="orders-table">
              <thead>
                <tr>
                  <th>Bill #</th>
                  <th>Customer</th>
                  <th>Amount</th>
                  <th>Payment</th>
                  <th>Date & Time</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.slice(0, 5).map(order => (
                  <tr key={order.billNo}>
                    <td><strong>#{order.billNo}</strong></td>
                    <td>{order.customerName}</td>
                    <td className="amount-cell">₹{order.total}</td>
                    <td><span className={`payment-badge ${order.paymentMethod.toLowerCase()}`}>{order.paymentMethod}</span></td>
                    <td>{(() => { const d = getOrderDate(order); return d ? d.toLocaleDateString('en-IN', {day: '2-digit', month: 'short'}) + ' ' + d.toLocaleTimeString('en-IN', {hour: '2-digit', minute: '2-digit'}) : '-'; })()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;
