import React, { useState } from 'react';
import { FiPlus, FiTrash2, FiEdit2, FiDollarSign, FiCalendar, FiDownload } from 'react-icons/fi';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import './Expenses.css';

const Expenses = () => {
  const [expenses, setExpenses] = useState([
    { id: 1, date: '2026-06-09', category: 'Raw Materials', description: 'Frozen Fries - 20KG', amount: 2400, paymentMode: 'Cash' },
    { id: 2, date: '2026-06-09', category: 'Raw Materials', description: 'Cooking Oil - 10L', amount: 1800, paymentMode: 'UPI' },
    { id: 3, date: '2026-06-09', category: 'Staff Salary', description: 'Chef - Ravi (June)', amount: 15000, paymentMode: 'Bank Transfer' },
    { id: 4, date: '2026-06-08', category: 'Rent', description: 'Shop Rent - June', amount: 25000, paymentMode: 'Bank Transfer' },
    { id: 5, date: '2026-06-08', category: 'Utilities', description: 'Electricity Bill', amount: 4500, paymentMode: 'UPI' },
    { id: 6, date: '2026-06-08', category: 'Raw Materials', description: 'Chicken - 15KG', amount: 3750, paymentMode: 'Cash' },
    { id: 7, date: '2026-06-07', category: 'Packaging', description: 'Boxes & Glasses', amount: 1200, paymentMode: 'Cash' },
    { id: 8, date: '2026-06-07', category: 'Marketing', description: 'Instagram Ads', amount: 2000, paymentMode: 'UPI' },
    { id: 9, date: '2026-06-07', category: 'Maintenance', description: 'AC Repair', amount: 3000, paymentMode: 'Cash' },
    { id: 10, date: '2026-06-06', category: 'Raw Materials', description: 'Momos, Corn, Eggs', amount: 5500, paymentMode: 'Cash' },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newExpense, setNewExpense] = useState({
    date: new Date().toISOString().split('T')[0],
    category: '',
    description: '',
    amount: '',
    paymentMode: 'Cash'
  });
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterDate, setFilterDate] = useState('');

  const expenseCategories = [
    'Raw Materials',
    'Staff Salary',
    'Rent',
    'Utilities',
    'Packaging',
    'Marketing',
    'Maintenance',
    'Transport',
    'Miscellaneous'
  ];

  const handleAddExpense = () => {
    if (!newExpense.description || !newExpense.amount || !newExpense.category) {
      alert('Please fill all required fields!');
      return;
    }
    setExpenses([{
      ...newExpense,
      id: Date.now(),
      amount: Number(newExpense.amount)
    }, ...expenses]);
    setNewExpense({
      date: new Date().toISOString().split('T')[0],
      category: '',
      description: '',
      amount: '',
      paymentMode: 'Cash'
    });
    setShowAddModal(false);
  };

  const deleteExpense = (id) => {
    if (window.confirm('Delete this expense?')) {
      setExpenses(expenses.filter(e => e.id !== id));
    }
  };

  // Filtered expenses
  const filteredExpenses = expenses.filter(e => {
    const matchCategory = filterCategory === 'All' || e.category === filterCategory;
    const matchDate = !filterDate || e.date === filterDate;
    return matchCategory && matchDate;
  });

  // Calculations
  const todayTotal = expenses
    .filter(e => e.date === new Date().toISOString().split('T')[0])
    .reduce((sum, e) => sum + e.amount, 0);
  
  const monthTotal = expenses
    .filter(e => e.date.startsWith(new Date().toISOString().slice(0, 7)))
    .reduce((sum, e) => sum + e.amount, 0);

  const categoryTotals = expenseCategories.map(cat => ({
    category: cat,
    total: expenses.filter(e => e.category === cat).reduce((sum, e) => sum + e.amount, 0)
  })).filter(c => c.total > 0).sort((a, b) => b.total - a.total);

  return (
    <div className="expenses-page">
      <div className="page-header">
        <div>
          <h1>Expenses</h1>
          <p>Track all shop expenses and costs</p>
        </div>
        <div style={{display: 'flex', gap: '10px'}}>
          <button className="btn btn-outline" onClick={() => {
            const doc = new jsPDF();
            doc.setFontSize(20);
            doc.setTextColor(233, 30, 99);
            doc.text('Couple Friendly Hub', 105, 20, { align: 'center' });
            doc.setFontSize(12);
            doc.setTextColor(100);
            doc.text('Expense Report', 105, 28, { align: 'center' });
            doc.setDrawColor(233, 30, 99);
            doc.line(20, 32, 190, 32);
            doc.setFontSize(11);
            doc.setTextColor(0);
            doc.text('Today\'s Expenses: Rs.' + todayTotal.toLocaleString('en-IN'), 20, 42);
            doc.text('Monthly Total: Rs.' + monthTotal.toLocaleString('en-IN'), 20, 49);
            autoTable(doc, {
              startY: 58,
              head: [['Date', 'Category', 'Description', 'Amount', 'Payment']],
              body: filteredExpenses.map(e => [
                new Date(e.date).toLocaleDateString('en-IN', {day: '2-digit', month: 'short'}),
                e.category,
                e.description,
                'Rs.' + e.amount.toLocaleString('en-IN'),
                e.paymentMode
              ]),
              theme: 'grid',
              headStyles: { fillColor: [233, 30, 99] },
              styles: { fontSize: 10 },
            });
            const finalY = doc.lastAutoTable.finalY + 10;
            doc.setFontSize(12);
            doc.setTextColor(0);
            doc.text('Total: Rs.' + filteredExpenses.reduce((s, e) => s + e.amount, 0).toLocaleString('en-IN'), 20, finalY);
            doc.setFontSize(9);
            doc.setTextColor(150);
            doc.text('Generated by Couple Friendly Hub POS System', 105, doc.internal.pageSize.height - 10, { align: 'center' });
            doc.save('CF_Hub_expenses_' + new Date().toISOString().split('T')[0] + '.pdf');
          }}>
            <FiDownload /> Export PDF
          </button>
          <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
            <FiPlus /> Add Expense
          </button>
        </div>
      </div>

      {/* Expense Stats */}
      <div className="expense-stats">
        <div className="expense-stat-card">
          <div className="expense-stat-icon" style={{background: 'linear-gradient(135deg, #e91e63, #ff6090)'}}>
            <FiDollarSign />
          </div>
          <div className="expense-stat-info">
            <h3>₹{todayTotal.toLocaleString('en-IN')}</h3>
            <p>Today's Expenses</p>
          </div>
        </div>
        <div className="expense-stat-card">
          <div className="expense-stat-icon" style={{background: 'linear-gradient(135deg, #9c27b0, #ba68c8)'}}>
            <FiCalendar />
          </div>
          <div className="expense-stat-info">
            <h3>₹{monthTotal.toLocaleString('en-IN')}</h3>
            <p>This Month</p>
          </div>
        </div>
        <div className="expense-stat-card">
          <div className="expense-stat-icon" style={{background: 'linear-gradient(135deg, #ff9800, #ffb74d)'}}>
            <FiDollarSign />
          </div>
          <div className="expense-stat-info">
            <h3>{expenses.length}</h3>
            <p>Total Entries</p>
          </div>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="expense-breakdown">
        <h3>Category Breakdown</h3>
        <div className="breakdown-list">
          {categoryTotals.map(ct => (
            <div className="breakdown-item" key={ct.category}>
              <span className="breakdown-category">{ct.category}</span>
              <span className="breakdown-amount">₹{ct.total.toLocaleString('en-IN')}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="expense-filters">
        <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
          <option value="All">All Categories</option>
          {expenseCategories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        <input 
          type="date" 
          value={filterDate} 
          onChange={(e) => setFilterDate(e.target.value)}
        />
        {(filterCategory !== 'All' || filterDate) && (
          <button className="btn btn-outline" onClick={() => { setFilterCategory('All'); setFilterDate(''); }}>
            Clear Filters
          </button>
        )}
      </div>

      {/* Expense Table */}
      <div className="expense-table-wrapper">
        <table className="expense-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Category</th>
              <th>Description</th>
              <th>Amount</th>
              <th>Payment</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredExpenses.map(expense => (
              <tr key={expense.id}>
                <td>{new Date(expense.date).toLocaleDateString('en-IN', {day: '2-digit', month: 'short'})}</td>
                <td><span className="expense-category-badge">{expense.category}</span></td>
                <td>{expense.description}</td>
                <td className="expense-amount">₹{expense.amount.toLocaleString('en-IN')}</td>
                <td>
                  <span className={`badge ${expense.paymentMode === 'Cash' ? 'badge-veg' : expense.paymentMode === 'UPI' ? 'badge-success' : 'badge-warning'}`}>
                    {expense.paymentMode}
                  </span>
                </td>
                <td>
                  <button className="expense-delete-btn" onClick={() => deleteExpense(expense.id)}>
                    <FiTrash2 />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredExpenses.length === 0 && (
          <div className="empty-state" style={{padding: '40px', textAlign: 'center'}}>
            <p>No expenses found for the selected filter.</p>
          </div>
        )}
      </div>

      {/* Add Expense Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2>Add Expense</h2>
            <div className="input-group">
              <label>Date</label>
              <input type="date" value={newExpense.date} onChange={(e) => setNewExpense({...newExpense, date: e.target.value})} />
            </div>
            <div className="input-group">
              <label>Category</label>
              <select value={newExpense.category} onChange={(e) => setNewExpense({...newExpense, category: e.target.value})} style={{width: '100%', padding: '12px', borderRadius: '8px', border: '2px solid #e5e7eb', fontSize: '14px'}}>
                <option value="">Select Category</option>
                {expenseCategories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div className="input-group">
              <label>Description</label>
              <input type="text" value={newExpense.description} onChange={(e) => setNewExpense({...newExpense, description: e.target.value})} placeholder="e.g., Chicken 10KG from supplier" />
            </div>
            <div className="modal-row">
              <div className="input-group">
                <label>Amount (₹)</label>
                <input type="number" value={newExpense.amount} onChange={(e) => setNewExpense({...newExpense, amount: e.target.value})} placeholder="0" />
              </div>
              <div className="input-group">
                <label>Payment Mode</label>
                <select value={newExpense.paymentMode} onChange={(e) => setNewExpense({...newExpense, paymentMode: e.target.value})} style={{width: '100%', padding: '12px', borderRadius: '8px', border: '2px solid #e5e7eb', fontSize: '14px'}}>
                  <option value="Cash">Cash</option>
                  <option value="UPI">UPI</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="Card">Card</option>
                </select>
              </div>
            </div>
            <div className="modal-actions">
              <button className="btn btn-outline" onClick={() => setShowAddModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleAddExpense}>Add Expense</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Expenses;
