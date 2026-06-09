import React, { useState, useRef } from 'react';
import { FiPlus, FiMinus, FiTrash2, FiPrinter, FiSend, FiUser, FiPhone } from 'react-icons/fi';
import { useOrders } from '../context/OrderContext';
import menuItems, { categories } from '../data/menuItems';
import './Billing.css';

const Billing = () => {
  const { addOrder } = useOrders();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [cart, setCart] = useState([]);
  const [customerName, setCustomerName] = useState('');
  const [customerMobile, setCustomerMobile] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [showPayment, setShowPayment] = useState(false);
  const [showBill, setShowBill] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentBillNo, setCurrentBillNo] = useState(null);
  const billNoRef = useRef(null);

  const filteredItems = menuItems.filter(item => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch && item.isAvailable;
  });

  const addToCart = (item) => {
    const existing = cart.find(c => c.id === item.id);
    if (existing) {
      setCart(cart.map(c => c.id === item.id ? { ...c, qty: c.qty + 1 } : c));
    } else {
      setCart([...cart, { ...item, qty: 1 }]);
    }
  };

  const updateQty = (id, delta) => {
    setCart(cart.map(c => {
      if (c.id === id) {
        const newQty = c.qty + delta;
        return newQty > 0 ? { ...c, qty: newQty } : c;
      }
      return c;
    }).filter(c => c.qty > 0));
  };

  const removeItem = (id) => {
    setCart(cart.filter(c => c.id !== id));
  };

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const gst = Math.round(subtotal * 0.05);
  const total = subtotal + gst;
  const billNo = Math.floor(1000 + Math.random() * 9000);

  const handlePayment = () => {
    if (!customerName || !customerMobile) {
      alert('Please enter customer details!');
      return;
    }
    if (cart.length === 0) {
      alert('Cart is empty!');
      return;
    }
    setShowPayment(true);
  };

  const generateBill = async () => {
    if (!paymentMethod) {
      alert('Please select payment method!');
      return;
    }
    // Generate bill number IMMEDIATELY and store in ref for instant access
    const generatedBillNo = Math.floor(1000 + Math.random() * 9000);
    billNoRef.current = generatedBillNo;
    setCurrentBillNo(generatedBillNo);
    setShowPayment(false);
    setShowBill(true);
    
    // Save order to Firebase in background
    try {
      const order = await addOrder({
        customerName,
        customerMobile,
        items: cart.map(item => ({ id: item.id, name: item.name, price: item.price, qty: item.qty })),
        paymentMethod,
        subtotal,
        gst,
        total,
        billNo: generatedBillNo
      });
      // Update with Firebase sequential bill number if available
      if (order && order.billNo) {
        billNoRef.current = order.billNo;
        setCurrentBillNo(order.billNo);
      }
    } catch (error) {
      console.error('Order save error:', error);
    }
  };

  const resetBilling = () => {
    setCart([]);
    setCustomerName('');
    setCustomerMobile('');
    setPaymentMethod('');
    setShowBill(false);
    setShowPayment(false);
  };

  return (
    <div className="billing">
      <div className="page-header">
        <h1>Customer Billing</h1>
        <p>Create new order and generate bill</p>
      </div>

      <div className="billing-layout">
        {/* Menu Section */}
        <div className="menu-section">
          {/* Search */}
          <div className="menu-search">
            <input
              type="text"
              placeholder="Search menu items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Categories */}
          <div className="category-tabs">
            {categories.map(cat => (
              <button
                key={cat}
                className={`cat-tab ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Menu Items Grid */}
          <div className="menu-grid">
            {filteredItems.map(item => (
              <div className="menu-item-card" key={item.id} onClick={() => addToCart(item)}>
                <div className="menu-item-image">
                  <img 
                    src={item.image} 
                    alt={item.name}
                    onError={(e) => { e.target.onerror = null; e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400'; }}
                  />
                  <span className={`veg-badge ${item.isVeg ? 'veg' : 'nonveg'}`}>
                    {item.isVeg ? '🟢' : '🔴'}
                  </span>
                </div>
                <div className="menu-item-details">
                  <h4>{item.name}</h4>
                  <p className="menu-item-price">₹{item.price}</p>
                </div>
                <button className="add-btn">
                  <FiPlus />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Cart Section */}
        <div className="cart-section">
          <div className="cart-card">
            {/* Customer Details */}
            <div className="customer-details">
              <h3>Customer Details</h3>
              <div className="customer-input">
                <FiUser />
                <input
                  type="text"
                  placeholder="Customer Name"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                />
              </div>
              <div className="customer-input">
                <FiPhone />
                <input
                  type="tel"
                  placeholder="Mobile Number"
                  maxLength={10}
                  value={customerMobile}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                    setCustomerMobile(val);
                  }}
                />
              </div>
            </div>

            {/* Cart Items */}
            <div className="cart-items">
              <h3>Cart ({cart.length} items)</h3>
              {cart.length === 0 ? (
                <div className="empty-cart">
                  <p>🛒 Add items from menu</p>
                </div>
              ) : (
                <div className="cart-list">
                  {cart.map(item => (
                    <div className="cart-item" key={item.id}>
                      <div className="cart-item-info">
                        <h4>{item.name}</h4>
                        <p>₹{item.price} each</p>
                      </div>
                      <div className="cart-item-controls">
                        <button onClick={() => updateQty(item.id, -1)}><FiMinus /></button>
                        <span>{item.qty}</span>
                        <button onClick={() => updateQty(item.id, 1)}><FiPlus /></button>
                      </div>
                      <div className="cart-item-total">
                        <span>₹{item.price * item.qty}</span>
                        <button className="remove-btn" onClick={() => removeItem(item.id)}>
                          <FiTrash2 />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Cart Summary */}
            {cart.length > 0 && (
              <div className="cart-summary">
                <div className="summary-row">
                  <span>Subtotal</span>
                  <span>₹{subtotal}</span>
                </div>
                <div className="summary-row">
                  <span>GST (5%)</span>
                  <span>₹{gst}</span>
                </div>
                <div className="summary-row total">
                  <span>Total</span>
                  <span>₹{total}</span>
                </div>
                <button className="btn btn-primary generate-bill-btn" onClick={handlePayment}>
                  Proceed to Payment
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {showPayment && (
        <div className="modal-overlay" onClick={() => setShowPayment(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2>Select Payment Method</h2>
            <div className="payment-options">
              <label className={`payment-option ${paymentMethod === 'Cash' ? 'selected' : ''}`}>
                <input type="radio" name="payment" value="Cash" onChange={(e) => setPaymentMethod(e.target.value)} />
                <span>💵</span>
                <p>Cash</p>
              </label>
              <label className={`payment-option ${paymentMethod === 'UPI' ? 'selected' : ''}`}>
                <input type="radio" name="payment" value="UPI" onChange={(e) => setPaymentMethod(e.target.value)} />
                <span>📱</span>
                <p>UPI</p>
              </label>
              <label className={`payment-option ${paymentMethod === 'Card' ? 'selected' : ''}`}>
                <input type="radio" name="payment" value="Card" onChange={(e) => setPaymentMethod(e.target.value)} />
                <span>💳</span>
                <p>Card</p>
              </label>
            </div>
            <button className="btn btn-success" style={{width: '100%', marginTop: '20px'}} onClick={generateBill}>
              Generate Bill
            </button>
          </div>
        </div>
      )}

      {/* Bill Modal */}
      {showBill && (
        <div className="modal-overlay">
          <div className="modal bill-modal">
            <div className="bill-receipt">
              <div className="bill-header">
                <img src="/logo.png" alt="Couple Friendly Hub" style={{width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover', marginBottom: '8px'}} />
                <h2>Couple Friendly Hub</h2>
                <p>Bill No: #{currentBillNo || billNoRef.current || billNo}</p>
                <p>{new Date().toLocaleDateString('en-IN')} | {new Date().toLocaleTimeString('en-IN', {hour: '2-digit', minute: '2-digit'})}</p>
              </div>
              <div className="bill-customer">
                <p><strong>Customer:</strong> {customerName}</p>
                <p><strong>Mobile:</strong> {customerMobile}</p>
              </div>
              <div className="bill-divider">- - - - - - - - - - - - - - - -</div>
              <div className="bill-items">
                {cart.map(item => (
                  <div className="bill-item" key={item.id}>
                    <span>{item.name}</span>
                    <span>{item.qty} x ₹{item.price} = ₹{item.qty * item.price}</span>
                  </div>
                ))}
              </div>
              <div className="bill-divider">- - - - - - - - - - - - - - - -</div>
              <div className="bill-total">
                <p>Subtotal: ₹{subtotal}</p>
                <p>GST (5%): ₹{gst}</p>
                <h3>Total: ₹{total}</h3>
                <p>Payment: {paymentMethod}</p>
              </div>
              <div className="bill-divider">- - - - - - - - - - - - - - - -</div>
              <p className="bill-thanks">Thank you! Visit Again 💕</p>
            </div>
            <div className="bill-actions">
              <button className="btn btn-primary" onClick={() => window.print()}>
                <FiPrinter /> Print Bill
              </button>
              <button className="btn btn-success" onClick={() => {
                const billText = 
`*🧾 Couple Friendly Hub*
━━━━━━━━━━━━━━━━
Bill No: #${currentBillNo || billNoRef.current || billNo}
Date: ${new Date().toLocaleDateString('en-IN')} | ${new Date().toLocaleTimeString('en-IN', {hour: '2-digit', minute: '2-digit'})}

*Customer:* ${customerName}
*Mobile:* ${customerMobile}
━━━━━━━━━━━━━━━━
${cart.map(item => `${item.name} x${item.qty} = ₹${item.price * item.qty}`).join('\n')}
━━━━━━━━━━━━━━━━
Subtotal: ₹${subtotal}
GST (5%): ₹${gst}
*Total: ₹${total}*
Payment: ${paymentMethod}
━━━━━━━━━━━━━━━━
_Thank you for visiting!_ 💕
_Visit Again - Couple Friendly Hub_
📍 Chennai Food Street, Perungudi`;
                const encodedMsg = encodeURIComponent(billText);
                const customerNum = customerMobile.startsWith('91') ? customerMobile : '91' + customerMobile;
                window.open(`https://wa.me/${customerNum}?text=${encodedMsg}`, '_blank');
              }}>
                <FiSend /> Send WhatsApp
              </button>
              <button className="btn btn-outline" onClick={resetBilling}>
                New Order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Billing;
