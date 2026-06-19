import React, { createContext, useContext, useState, useEffect } from 'react';
import { CoupleDB } from '../firebase';

const OrderContext = createContext();

export const useOrders = () => useContext(OrderContext);

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const [lastOrderId, setLastOrderId] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Load orders from Firebase on mount and listen for real-time updates
  useEffect(() => {
    const unsubscribe = CoupleDB.onOrdersChange((firebaseOrders) => {
      setOrders(firebaseOrders);
      setIsLoading(false);
      console.log('🔥 Orders updated from Firebase:', firebaseOrders.length);
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const addOrder = async (order) => {
    try {
      // Get professional order ID: CF-MMDD-XXX
      const orderId = await CoupleDB.getNextOrderNumber();
      setLastOrderId(orderId);
      
      const newOrder = {
        ...order,
        id: orderId,
        billNo: orderId,
        createdAt: new Date().toISOString(),
        status: 'completed'
      };

      // Save to Firebase - the real-time listener will auto-update the orders state
      await CoupleDB.saveOrder(newOrder);
      
      console.log('✅ Order created and saved to Firebase:', orderId);
      return newOrder;
    } catch (error) {
      console.error('❌ Error creating order:', error);
      // Fallback: generate local order ID
      const now = new Date();
      const mm = String(now.getMonth() + 1).padStart(2, '0');
      const dd = String(now.getDate()).padStart(2, '0');
      const sec = String(now.getSeconds()).padStart(3, '0');
      const fallbackId = `CF-${mm}${dd}-${sec}`;
      setLastOrderId(fallbackId);
      const newOrder = {
        ...order,
        id: fallbackId,
        billNo: fallbackId,
        createdAt: new Date().toISOString(),
        status: 'completed'
      };
      setOrders(prev => [newOrder, ...prev]);
      return newOrder;
    }
  };

  const getTodayOrders = () => {
    const today = new Date().toDateString();
    return orders.filter(o => new Date(o.createdAt).toDateString() === today);
  };

  const getTodaySales = () => {
    const todayOrders = getTodayOrders();
    return todayOrders.reduce((sum, o) => sum + (o.total || 0), 0);
  };

  const getTodayCash = () => {
    const todayOrders = getTodayOrders();
    return todayOrders.filter(o => o.paymentMethod === 'Cash').reduce((sum, o) => sum + (o.total || 0), 0);
  };

  const getTodayUPI = () => {
    const todayOrders = getTodayOrders();
    return todayOrders.filter(o => o.paymentMethod === 'UPI').reduce((sum, o) => sum + (o.total || 0), 0);
  };

  const getTodayCard = () => {
    const todayOrders = getTodayOrders();
    return todayOrders.filter(o => o.paymentMethod === 'Card').reduce((sum, o) => sum + (o.total || 0), 0);
  };

  const getTopSellingItem = () => {
    const todayOrders = getTodayOrders();
    const itemCount = {};
    todayOrders.forEach(order => {
      if (order.items) {
        order.items.forEach(item => {
          itemCount[item.name] = (itemCount[item.name] || 0) + item.qty;
        });
      }
    });
    const sorted = Object.entries(itemCount).sort((a, b) => b[1] - a[1]);
    return sorted.length > 0 ? sorted[0][0] : 'No orders yet';
  };

  const getRecentOrders = () => {
    return orders.slice(0, 10);
  };

  return (
    <OrderContext.Provider value={{
      orders,
      addOrder,
      getTodayOrders,
      getTodaySales,
      getTodayCash,
      getTodayUPI,
      getTodayCard,
      getTopSellingItem,
      getRecentOrders,
      lastOrderId,
      isLoading
    }}>
      {children}
    </OrderContext.Provider>
  );
};
