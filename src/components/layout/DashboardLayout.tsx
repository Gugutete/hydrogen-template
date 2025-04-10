import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useUIStore } from '../../lib/store';
import { useAuth } from '../../hooks/useAuth';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { sidebarOpen, setSidebarOpen, toggleSidebar } = useUIStore();
  const { logout, user } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [setSidebarOpen]);

  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: 'home' },
    { name: 'Bus', href: '/buses', icon: 'bus' },
    { name: 'Autisti', href: '/drivers', icon: 'users' },
    { name: 'Tour', href: '/tours', icon: 'calendar' },
    { name: 'Agenzie', href: '/agencies', icon: 'building' },
    { name: 'Manutenzione', href: '/maintenance', icon: 'tool' },
  ];

  return (
    <div className="app-container">
      {/* Sidebar */}
      <div
        className={`sidebar ${!sidebarOpen ? 'hidden' : ''}`}
        style={{ transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)', transition: 'transform 0.3s ease-in-out' }}
      >
        <div className="sidebar-header">Schiavo Bus</div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          {navItems.map((item) => {
            const isActive = location.pathname === item.href;

            return (
              <Link
                key={item.name}
                to={item.href}
                className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
              >
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  border: '1px solid rgba(255, 255, 255, 0.5)',
                  marginRight: '14px',
                  minWidth: '28px',
                  backgroundColor: isActive ? 'rgba(255, 255, 255, 0.2)' : 'transparent'
                }}>
                  <svg xmlns="http://www.w3.org/2000/svg" style={{ width: '16px', height: '16px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {item.icon === 'home' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />}
                  {item.icon === 'bus' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h8m-8 5h8m-4 3v3m-8-3v3m0-10a2 2 0 012-2h12a2 2 0 012 2v7a2 2 0 01-2 2H6a2 2 0 01-2-2V7z" />}
                  {item.icon === 'users' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />}
                  {item.icon === 'calendar' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />}
                  {item.icon === 'building' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />}
                  {item.icon === 'tool' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />}
                  </svg>
                </div>
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* User Info & Logout */}
        <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)', padding: '1rem', marginTop: 'auto' }}>
          {user && (
            <div style={{ marginBottom: '0.5rem', fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.8)' }}>
              {user.email}
            </div>
          )}
          <button
            onClick={logout}
            className="sidebar-nav-item logout-button"
            style={{
              backgroundColor: '#3730a3',
              marginTop: '1rem',
              transition: 'all 0.2s ease',
              color: 'white',
              fontWeight: 500,
              borderRadius: '0.375rem',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#312e81'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#3730a3'}
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              border: '1px solid rgba(255, 255, 255, 0.5)',
              marginRight: '14px',
              minWidth: '28px'
            }}>
              <svg xmlns="http://www.w3.org/2000/svg" style={{ width: '16px', height: '16px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </div>
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Top Bar */}
        <header className="header">
          <button
            onClick={toggleSidebar}
            className="btn btn-white md:hidden"
            style={{ padding: '0.5rem' }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="text-xl font-semibold text-gray-800 md:hidden">
            Schiavo Bus
          </div>
          <div className="flex items-center">
            {/* Add any header elements here */}
          </div>
        </header>

        {/* Page Content */}
        {children}
      </div>
    </div>
  );
};

export default DashboardLayout;
