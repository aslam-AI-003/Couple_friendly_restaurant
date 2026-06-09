import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc, getDocs, query, orderBy, onSnapshot, updateDoc, deleteDoc, getDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyA0h41dnLHhll9QebR4fkiaiG8C3cdo8Es",
  authDomain: "abm-billing.firebaseapp.com",
  projectId: "abm-billing",
  storageBucket: "abm-billing.firebasestorage.app",
  messagingSenderId: "774462936172",
  appId: "1:774462936172:web:3312f7c3876aa09ba77449",
  measurementId: "G-6ZN8GZYY8Q"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Firestore Collections
const ordersCollection = collection(db, 'cf_orders');
const productsCollection = collection(db, 'cf_products');
const stockCollection = collection(db, 'cf_stock');
const configCollection = collection(db, 'cf_config');

// ===== COUPLE FRIENDLY HUB - FIRESTORE OPERATIONS =====
export const CoupleDB = {

  // --- ORDERS ---
  async saveOrder(order) {
    try {
      await setDoc(doc(db, 'cf_orders', order.id.toString()), {
        ...order,
        createdAt: order.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      console.log('✅ Order saved to Firebase:', order.id);
      return true;
    } catch (error) {
      console.error('❌ Error saving order:', error);
      return false;
    }
  },

  async getAllOrders() {
    try {
      const snapshot = await getDocs(query(ordersCollection, orderBy('createdAt', 'desc')));
      const orders = [];
      snapshot.docs.forEach(doc => {
        orders.push(doc.data());
      });
      console.log(`✅ Loaded ${orders.length} orders from Firebase`);
      return orders;
    } catch (error) {
      console.error('❌ Error getting orders:', error);
      return [];
    }
  },

  // Real-time listener for orders
  onOrdersChange(callback) {
    return onSnapshot(
      query(ordersCollection, orderBy('createdAt', 'desc')),
      (snapshot) => {
        const orders = [];
        snapshot.docs.forEach(doc => {
          orders.push(doc.data());
        });
        callback(orders);
      },
      (error) => {
        console.error('❌ Real-time orders listener error:', error);
      }
    );
  },

  // Get next order number
  async getNextOrderNumber() {
    try {
      const counterDoc = await getDoc(doc(db, 'cf_config', 'counter'));
      let nextNum = 1021;
      
      if (counterDoc.exists()) {
        nextNum = counterDoc.data().lastOrderNumber + 1;
      }
      
      // Update counter
      await setDoc(doc(db, 'cf_config', 'counter'), {
        lastOrderNumber: nextNum,
        updatedAt: new Date().toISOString()
      });
      
      return nextNum;
    } catch (error) {
      console.error('❌ Error getting next order number:', error);
      return Date.now() % 10000 + 1000;
    }
  },

  // --- PRODUCTS ---
  async saveProduct(product) {
    try {
      await setDoc(doc(db, 'cf_products', product.id), {
        ...product,
        updatedAt: new Date().toISOString()
      });
      return true;
    } catch (error) {
      console.error('❌ Error saving product:', error);
      return false;
    }
  },

  async getAllProducts() {
    try {
      const snapshot = await getDocs(productsCollection);
      const products = [];
      snapshot.docs.forEach(doc => {
        products.push(doc.data());
      });
      return products;
    } catch (error) {
      console.error('❌ Error getting products:', error);
      return [];
    }
  },

  async deleteProduct(productId) {
    try {
      await deleteDoc(doc(db, 'cf_products', productId));
      return true;
    } catch (error) {
      console.error('❌ Error deleting product:', error);
      return false;
    }
  },

  // --- STOCK ---
  async saveStockItem(item) {
    try {
      await setDoc(doc(db, 'cf_stock', item.id.toString()), {
        ...item,
        updatedAt: new Date().toISOString()
      });
      return true;
    } catch (error) {
      console.error('❌ Error saving stock:', error);
      return false;
    }
  },

  async getAllStock() {
    try {
      const snapshot = await getDocs(stockCollection);
      const stock = [];
      snapshot.docs.forEach(doc => {
        stock.push(doc.data());
      });
      return stock;
    } catch (error) {
      console.error('❌ Error getting stock:', error);
      return [];
    }
  },

  async updateStock(itemId, updates) {
    try {
      await updateDoc(doc(db, 'cf_stock', itemId.toString()), {
        ...updates,
        updatedAt: new Date().toISOString()
      });
      return true;
    } catch (error) {
      console.error('❌ Error updating stock:', error);
      return false;
    }
  }
};

export { db, auth, app };
export default app;
