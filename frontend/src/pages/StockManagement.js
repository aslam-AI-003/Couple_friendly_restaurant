import React, { useState } from 'react';
import { FiPackage, FiAlertTriangle, FiPlus, FiMinus } from 'react-icons/fi';
import './StockManagement.css';

const StockManagement = () => {
  const [stockItems, setStockItems] = useState([]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showManualEntry, setShowManualEntry] = useState(false);
  const [manualEntry, setManualEntry] = useState({ itemId: '', quantity: '', notes: '' });
  const [newStock, setNewStock] = useState({ name: '', category: '', quantity: '', unit: 'KG', minStock: '', perItemUsage: '' });
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [stockLog, setStockLog] = useState([]);

  const lowStockItems = stockItems.filter(item => item.quantity <= item.minStock);
  const stockCategories = [...new Set(stockItems.map(item => item.category))];

  const updateStock = (id, delta) => {
    setStockItems(stockItems.map(item => 
      item.id === id ? { ...item, quantity: Math.max(0, item.quantity + delta) } : item
    ));
  };

  const handleAddStock = () => {
    if (!newStock.name || !newStock.quantity) return;
    setStockItems([...stockItems, {
      ...newStock,
      id: Date.now(),
      quantity: Number(newStock.quantity),
      minStock: Number(newStock.minStock) || 10
    }]);
    setNewStock({ name: '', category: '', quantity: '', unit: 'KG', minStock: '' });
    setShowNewCategory(false);
    setNewCategoryName('');
    setShowAddModal(false);
  };

  const getStockStatus = (item) => {
    const ratio = item.quantity / item.minStock;
    if (ratio <= 1) return 'danger';
    if (ratio <= 2) return 'warning';
    return 'good';
  };

  return (
    <div className="stock-management">
      <div className="page-header">
        <div>
          <h1>Stock Management</h1>
          <p>Track raw materials and inventory</p>
        </div>
        <div className="header-actions">
          <button className="btn btn-success" onClick={() => setShowManualEntry(true)}>
            📦 Manual Stock Entry
          </button>
          <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
            <FiPlus /> Add New Item
          </button>
        </div>
      </div>

      {/* Low Stock Alert */}
      {lowStockItems.length > 0 && (
        <div className="low-stock-banner">
          <FiAlertTriangle />
          <span><strong>{lowStockItems.length} items</strong> are running low on stock!</span>
        </div>
      )}

      {/* Stock by Category */}
      {stockCategories.map(category => (
        <div className="stock-category-section" key={category}>
          <h2 className="stock-category-title">
            <FiPackage /> {category}
          </h2>
          <div className="stock-table">
            <table>
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Current Stock</th>
                  <th>Min. Required</th>
                  <th>Usage/Item</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {stockItems.filter(item => item.category === category).map(item => (
                  <tr key={item.id} className={getStockStatus(item) === 'danger' ? 'row-danger' : ''}>
                    <td><strong>{item.name}</strong></td>
                    <td>{item.quantity} {item.unit}</td>
                    <td>{item.minStock} {item.unit}</td>
                    <td>{item.perItemUsage}</td>
                    <td>
                      <span className={`stock-status ${getStockStatus(item)}`}>
                        {getStockStatus(item) === 'danger' ? '⚠️ Low' : 
                         getStockStatus(item) === 'warning' ? '⚡ Medium' : '✅ Good'}
                      </span>
                    </td>
                    <td>
                      <div className="stock-actions">
                        <button className="stock-btn minus" onClick={() => updateStock(item.id, -1)}>
                          <FiMinus />
                        </button>
                        <button className="stock-btn plus" onClick={() => updateStock(item.id, 5)}>
                          <FiPlus /> 5
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}

      {/* Add Stock Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2>Add Stock Item</h2>
            <div className="input-group">
              <label>Item Name</label>
              <input type="text" value={newStock.name} onChange={(e) => setNewStock({...newStock, name: e.target.value})} placeholder="e.g., Frozen Fries" />
            </div>
            <div className="input-group">
              <label>Category</label>
              {!showNewCategory ? (
                <div>
                  <select 
                    value={newStock.category} 
                    onChange={(e) => {
                      if (e.target.value === '__new__') {
                        setShowNewCategory(true);
                        setNewStock({...newStock, category: ''});
                      } else {
                        setNewStock({...newStock, category: e.target.value});
                      }
                    }}
                    style={{width: '100%', padding: '12px', borderRadius: '8px', border: '2px solid #e5e7eb', fontSize: '14px'}}
                  >
                    <option value="">Select Category</option>
                    {stockCategories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                    <option value="__new__">➕ Add New Category</option>
                  </select>
                </div>
              ) : (
                <div style={{display: 'flex', gap: '8px'}}>
                  <input 
                    type="text" 
                    value={newCategoryName} 
                    onChange={(e) => {
                      setNewCategoryName(e.target.value);
                      setNewStock({...newStock, category: e.target.value});
                    }} 
                    placeholder="Enter new category name" 
                    style={{flex: 1}}
                    autoFocus
                  />
                  <button 
                    className="btn btn-outline" 
                    onClick={() => { setShowNewCategory(false); setNewCategoryName(''); }}
                    style={{padding: '8px 12px', fontSize: '12px'}}
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
            <div className="modal-row">
              <div className="input-group">
                <label>Quantity</label>
                <input type="number" value={newStock.quantity} onChange={(e) => setNewStock({...newStock, quantity: e.target.value})} placeholder="20" />
              </div>
              <div className="input-group">
                <label>Unit</label>
                <select value={newStock.unit} onChange={(e) => setNewStock({...newStock, unit: e.target.value})}>
                  <option value="KG">KG</option>
                  <option value="Litre">Litre</option>
                  <option value="pcs">Pieces</option>
                  <option value="gm">Grams</option>
                </select>
              </div>
            </div>
            <div className="input-group">
              <label>Minimum Stock Level</label>
              <input type="number" value={newStock.minStock} onChange={(e) => setNewStock({...newStock, minStock: e.target.value})} placeholder="10" />
            </div>
            <div className="modal-actions">
              <button className="btn btn-outline" onClick={() => setShowAddModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleAddStock}>Add Item</button>
            </div>
          </div>
        </div>
      )}

      {/* Manual Stock Entry Modal */}
      {showManualEntry && (
        <div className="modal-overlay" onClick={() => setShowManualEntry(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2>📦 Manual Stock Entry</h2>
            <p style={{color: '#666', fontSize: '13px', marginBottom: '16px'}}>Add stock when you receive purchases (KG, Litre, pcs)</p>
            
            <div className="input-group">
              <label>Select Item</label>
              <select 
                value={manualEntry.itemId} 
                onChange={(e) => setManualEntry({...manualEntry, itemId: e.target.value})}
                style={{width: '100%', padding: '12px', borderRadius: '8px', border: '2px solid #e5e7eb', fontSize: '14px'}}
              >
                <option value="">-- Choose an item --</option>
                {stockCategories.map(cat => (
                  <optgroup label={cat} key={cat}>
                    {stockItems.filter(i => i.category === cat).map(item => (
                      <option key={item.id} value={item.id}>
                        {item.name} (Current: {item.quantity} {item.unit})
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>

            {manualEntry.itemId && (
              <div className="manual-entry-info">
                {(() => {
                  const selectedItem = stockItems.find(i => i.id === Number(manualEntry.itemId));
                  if (!selectedItem) return null;
                  return (
                    <div className="selected-item-card">
                      <div className="selected-item-details">
                        <strong>{selectedItem.name}</strong>
                        <span>Current: <b>{selectedItem.quantity} {selectedItem.unit}</b></span>
                        <span>Min Required: {selectedItem.minStock} {selectedItem.unit}</span>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}

            <div className="modal-row">
              <div className="input-group">
                <label>Add Quantity</label>
                <input 
                  type="number" 
                  value={manualEntry.quantity} 
                  onChange={(e) => setManualEntry({...manualEntry, quantity: e.target.value})} 
                  placeholder="e.g., 10"
                  min="0"
                  step="0.5"
                />
              </div>
              <div className="input-group">
                <label>Unit</label>
                <input 
                  type="text" 
                  value={manualEntry.itemId ? (stockItems.find(i => i.id === Number(manualEntry.itemId))?.unit || '') : ''}
                  disabled
                  style={{background: '#f5f5f5', cursor: 'not-allowed'}}
                />
              </div>
            </div>

            <div className="input-group">
              <label>Notes (optional)</label>
              <input 
                type="text" 
                value={manualEntry.notes} 
                onChange={(e) => setManualEntry({...manualEntry, notes: e.target.value})} 
                placeholder="e.g., Purchased from Metro Cash & Carry"
              />
            </div>

            <div className="modal-actions">
              <button className="btn btn-outline" onClick={() => { setShowManualEntry(false); setManualEntry({ itemId: '', quantity: '', notes: '' }); }}>
                Cancel
              </button>
              <button 
                className="btn btn-success" 
                onClick={() => {
                  if (!manualEntry.itemId || !manualEntry.quantity) {
                    alert('Please select an item and enter quantity!');
                    return;
                  }
                  const qty = Number(manualEntry.quantity);
                  const item = stockItems.find(i => i.id === Number(manualEntry.itemId));
                  
                  // Update stock
                  setStockItems(stockItems.map(i => 
                    i.id === Number(manualEntry.itemId) 
                      ? { ...i, quantity: i.quantity + qty } 
                      : i
                  ));
                  
                  // Add to log
                  setStockLog([{
                    id: Date.now(),
                    itemName: item.name,
                    quantity: qty,
                    unit: item.unit,
                    notes: manualEntry.notes,
                    date: new Date().toISOString()
                  }, ...stockLog]);
                  
                  alert(`✅ Added ${qty} ${item.unit} of ${item.name} successfully!`);
                  setManualEntry({ itemId: '', quantity: '', notes: '' });
                  setShowManualEntry(false);
                }}
              >
                ✅ Add Stock
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Stock Entry Log */}
      {stockLog.length > 0 && (
        <div className="stock-log-section">
          <h2 className="stock-category-title">📋 Recent Stock Entries</h2>
          <div className="stock-table">
            <table>
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Qty Added</th>
                  <th>Notes</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {stockLog.slice(0, 10).map(log => (
                  <tr key={log.id}>
                    <td><strong>{log.itemName}</strong></td>
                    <td style={{color: '#2e7d32', fontWeight: 600}}>+{log.quantity} {log.unit}</td>
                    <td>{log.notes || '-'}</td>
                    <td>{new Date(log.date).toLocaleDateString('en-IN', {day: '2-digit', month: 'short'})} {new Date(log.date).toLocaleTimeString('en-IN', {hour: '2-digit', minute: '2-digit'})}</td>
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

export default StockManagement;
