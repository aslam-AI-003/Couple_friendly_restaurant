import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { OrderProvider } from './context/OrderContext';
import useNetworkStatus from './hooks/useNetworkStatus';
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
  const { isOnline, showReconnected } = useNetworkStatus();
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('cf_logged_in') === 'true';
  });
  const [sidebarOpen, setSidebarOpen] = useState(() => window.innerWidth > 768);

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
        {/* Mobile hamburger menu button */}
        <button className="mobile-menu-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
          {sidebarOpen ? '✕' : '☰'}
        </button>
        {/* Mobile overlay */}
        <div className={`mobile-overlay ${sidebarOpen ? 'show' : ''}`} onClick={() => setSidebarOpen(false)}></div>
        
        <Sidebar isOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} onLogout={handleLogout} />
        <main className={`main-content ${sidebarOpen ? '' : 'expanded'}`}>
          {/* Network Status Banner */}
          {!isOnline && (
            <div className="network-banner offline">
              <span>🔴 No Internet Connection — Billing is paused until connection is restored</span>
            </div>
          )}
          {showReconnected && isOnline && (
            <div className="network-banner online">
              <span>✅ Back Online! You can continue billing.</span>
            </div>
          )}
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
