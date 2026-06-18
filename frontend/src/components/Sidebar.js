import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  FiHome, FiShoppingCart, FiGrid, FiPackage, 
  FiBarChart2, FiTrendingUp, FiMenu, FiLogOut,
  FiHeart, FiCreditCard, FiDownload
} from 'react-icons/fi';
import './Sidebar.css';

const Sidebar = ({ isOpen, toggleSidebar, onLogout }) => {
  const [installPrompt, setInstallPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Listen for the beforeinstallprompt event
    const handleBeforeInstall = (e) => {
      e.preventDefault();
      setInstallPrompt(e);
      console.log('✅ PWA: Install prompt ready');
    };

    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setInstallPrompt(null);
      console.log('✅ PWA: App installed successfully!');
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  const handleInstallClick = async () => {
    if (installPrompt) {
      installPrompt.prompt();
      const { outcome } = await installPrompt.userChoice;
      console.log(`PWA Install: ${outcome}`);
      if (outcome === 'accepted') {
        setInstallPrompt(null);
        setIsInstalled(true);
      }
    }
  };

  const menuItems = [
    { path: '/', icon: <FiHome />, label: 'Dashboard' },
    { path: '/billing', icon: <FiShoppingCart />, label: 'Billing' },
    { path: '/menu', icon: <FiGrid />, label: 'Menu' },
    { path: '/stock', icon: <FiPackage />, label: 'Stock' },
    { path: '/reports', icon: <FiBarChart2 />, label: 'Reports' },
    { path: '/analytics', icon: <FiTrendingUp />, label: 'Analytics' },
    { path: '/expenses', icon: <FiCreditCard />, label: 'Expenses' },
  ];

  return (
    <aside className={`sidebar ${isOpen ? 'open' : 'collapsed'}`}>
      <div className="sidebar-header">
        <div className="logo">
          <img src="/logo.png" alt="CF Hub" className="logo-img" />
          {isOpen && <span className="logo-text">Couple Friendly</span>}
        </div>
        <button className="toggle-btn" onClick={toggleSidebar}>
          <FiMenu />
        </button>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            onClick={() => { if (window.innerWidth <= 768) toggleSidebar(); }}
          >
            <span className="nav-icon">{item.icon}</span>
            {isOpen && <span className="nav-label">{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        {/* Install App Button - shows only when installable */}
        {installPrompt && !isInstalled && (
          <button className="nav-item install-btn" onClick={handleInstallClick}>
            <span className="nav-icon"><FiDownload /></span>
            {isOpen && <span className="nav-label">Install App</span>}
          </button>
        )}
        <button className="nav-item logout-btn" onClick={onLogout}>
          <span className="nav-icon"><FiLogOut /></span>
          {isOpen && <span className="nav-label">Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
