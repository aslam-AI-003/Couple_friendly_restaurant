import React, { createContext, useContext, useState, useEffect } from 'react';
import { CoupleDB } from '../firebase';

const OrderContext = createContext();

export const useOrders = () => useContext(OrderContext);

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const [orderCounter, setOrderCounter] = useState(1020);
  const [isLoading, setIsLoading] = useState(true);

  // Load orders from Firebase on mount and listen for real-time updates
  useEffect(() => {
    const unsubscribe = CoupleDB.onOrdersChange((firebaseOrders) => {
      setOrders(firebaseOrders);
      setIsLoading(false);
      console.log('🔥 Orders updated from Firebase:', firebaseOrders.length);
    });

    // Get the current order counter
    CoupleDB.getNextOrderNumber().then(num => {
      setOrderCounter(num - 1); // Set to last used number
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const addOrder = async (order) => {
    try {
      const newCounter = await CoupleDB.getNextOrderNumber();
      setOrderCounter(newCounter);
      
      const newOrder = {
        ...order,
        id: newCounter,
        billNo: newCounter,
        createdAt: new Date().toISOString(),
        status: 'completed'
      };

      // Save to Firebase - the real-time listener will auto-update the orders state
      await CoupleDB.saveOrder(newOrder);
      
      console.log('✅ Order created and saved to Firebase:', newCounter);
      return newOrder;
    } catch (error) {
      console.error('❌ Error creating order:', error);
      // Fallback: add to local state if Firebase fails
      const fallbackCounter = orderCounter + 1;
      setOrderCounter(fallbackCounter);
      const newOrder = {
        ...order,
        id: fallbackCounter,
        billNo: fallbackCounter,
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
      orderCounter,
      isLoading
    }}>
      {children}
    </OrderContext.Provider>
  );
};
