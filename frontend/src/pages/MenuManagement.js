import React, { useState } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiEye, FiEyeOff, FiSearch } from 'react-icons/fi';
import menuItems, { categories } from '../data/menuItems';
import './MenuManagement.css';

const MenuManagement = () => {
  const [items, setItems] = useState(menuItems);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [newItem, setNewItem] = useState({
    name: '', category: 'Loaded Fries', price: '', stock: '', description: '', image: '', isVeg: true
  });

  const filteredItems = items.filter(item => {
    const matchesCategory = filterCategory === 'All' || item.category === filterCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleAdd = () => {
    if (!newItem.name || !newItem.price) return;
    const item = {
      ...newItem,
      id: `custom-${Date.now()}`,
      price: Number(newItem.price),
      stock: Number(newItem.stock) || 100,
      isAvailable: true
    };
    setItems([...items, item]);
    setNewItem({ name: '', category: 'Loaded Fries', price: '', stock: '', description: '', image: '', isVeg: true });
    setShowAddModal(false);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      setItems(items.filter(i => i.id !== id));
    }
  };

  const toggleAvailability = (id) => {
    setItems(items.map(i => i.id === id ? { ...i, isAvailable: !i.isAvailable } : i));
  };

  const handleEdit = (item) => {
    setEditItem(item);
    setNewItem(item);
    setShowAddModal(true);
  };

  const handleUpdate = () => {
    setItems(items.map(i => i.id === editItem.id ? { ...newItem, price: Number(newItem.price), stock: Number(newItem.stock) } : i));
    setEditItem(null);
    setNewItem({ name: '', category: 'Loaded Fries', price: '', stock: '', description: '', image: '', isVeg: true });
    setShowAddModal(false);
  };

  return (
    <div className="menu-management">
      <div className="page-header">
        <div>
          <h1>Menu Management</h1>
          <p>Add, edit, or remove menu items</p>
        </div>
        <button className="btn btn-primary" onClick={() => { setEditItem(null); setShowAddModal(true); }}>
          <FiPlus /> Add Item
        </button>
      </div>

      {/* Filters */}
      <div className="menu-filters">
        <div className="search-box">
          <FiSearch />
          <input
            type="text"
            placeholder="Search items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* Items Grid */}
      <div className="menu-mgmt-grid">
        {filteredItems.map(item => (
          <div className={`menu-mgmt-card ${!item.isAvailable ? 'unavailable' : ''}`} key={item.id}>
            <div className="mgmt-card-image">
              <img src={item.image} alt={item.name} />
              <span className={`veg-indicator ${item.isVeg ? 'veg' : 'nonveg'}`}>
                {item.isVeg ? '🟢 Veg' : '🔴 Non-Veg'}
              </span>
              {!item.isAvailable && <div className="unavailable-overlay">Hidden</div>}
            </div>
            <div className="mgmt-card-body">
              <h3>{item.name}</h3>
              <p className="mgmt-category">{item.category}</p>
              <div className="mgmt-card-footer">
                <span className="mgmt-price">₹{item.price}</span>
                <span className="mgmt-stock">Stock: {item.stock}</span>
              </div>
              <div className="mgmt-actions">
                <button className="action-btn edit" onClick={() => handleEdit(item)} title="Edit">
                  <FiEdit2 />
                </button>
                <button className="action-btn toggle" onClick={() => toggleAvailability(item.id)} title={item.isAvailable ? 'Hide' : 'Show'}>
                  {item.isAvailable ? <FiEye /> : <FiEyeOff />}
                </button>
                <button className="action-btn delete" onClick={() => handleDelete(item.id)} title="Delete">
                  <FiTrash2 />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => { setShowAddModal(false); setEditItem(null); }}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2>{editItem ? 'Edit Item' : 'Add New Item'}</h2>
            <div className="input-group">
              <label>Item Name</label>
              <input
                type="text"
                value={newItem.name}
                onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                placeholder="Enter item name"
              />
            </div>
            <div className="input-group">
              <label>Category</label>
              <select value={newItem.category} onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}>
                {categories.filter(c => c !== 'All').map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div className="modal-row">
              <div className="input-group">
                <label>Price (₹)</label>
                <input
                  type="number"
                  value={newItem.price}
                  onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                  placeholder="99"
                />
              </div>
              <div className="input-group">
                <label>Stock Qty</label>
                <input
                  type="number"
                  value={newItem.stock}
                  onChange={(e) => setNewItem({ ...newItem, stock: e.target.value })}
                  placeholder="100"
                />
              </div>
            </div>
            <div className="input-group">
              <label>Image URL</label>
              <input
                type="text"
                value={newItem.image}
                onChange={(e) => setNewItem({ ...newItem, image: e.target.value })}
                placeholder="https://..."
              />
            </div>
            <div className="input-group">
              <label>Description</label>
              <input
                type="text"
                value={newItem.description}
                onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                placeholder="Short description"
              />
            </div>
            <div className="input-group">
              <label>Type</label>
              <div className="type-toggle">
                <button
                  className={`type-btn ${newItem.isVeg ? 'active veg' : ''}`}
                  onClick={() => setNewItem({ ...newItem, isVeg: true })}
                >🟢 Veg</button>
                <button
                  className={`type-btn ${!newItem.isVeg ? 'active nonveg' : ''}`}
                  onClick={() => setNewItem({ ...newItem, isVeg: false })}
                >🔴 Non-Veg</button>
              </div>
            </div>
            <div className="modal-actions">
              <button className="btn btn-outline" onClick={() => { setShowAddModal(false); setEditItem(null); }}>Cancel</button>
              <button className="btn btn-primary" onClick={editItem ? handleUpdate : handleAdd}>
                {editItem ? 'Update Item' : 'Add Item'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuManagement;
