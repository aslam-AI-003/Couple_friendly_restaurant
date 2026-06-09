import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { OrderProvider } from './context/OrderContext';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Billing from './pages/Billing';
import MenuManagement from './pages/MenuManagement';
import StockManagement from './pages/StockManagement';
import Reports from './pages/Reports';
import Analytics from './pages/Analytics';
import Expenses from './pages/Expenses';
import Login from './pages/Login';
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('cf_logged_in') === 'true';
  });
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = () => {
    localStorage.removeItem('cf_logged_in');
    localStorage.removeItem('cf_user');
    setIsLoggedIn(false);
  };

  if (!isLoggedIn) {
    return <Login onLogin={() => setIsLoggedIn(true)} />;
  }

  return (
    <OrderProvider>
    <Router>
      <div className="app">
        <Sidebar isOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} onLogout={handleLogout} />
        <main className={`main-content ${sidebarOpen ? '' : 'expanded'}`}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/billing" element={<Billing />} />
            <Route path="/menu" element={<MenuManagement />} />
            <Route path="/stock" element={<StockManagement />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/expenses" element={<Expenses />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </Router>
    </OrderProvider>
  );
}

export default App;
