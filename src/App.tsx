import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuthStore } from './lib/store';
import { getSession } from './lib/supabase';

// Pages
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import BusesPage from './pages/BusesPage';
import DriversPage from './pages/DriversPage';
import ToursPage from './pages/ToursPage';
import AgenciesPage from './pages/AgenciesPage';
import MaintenancePage from './pages/MaintenancePage';

function App() {
  const { setUser, setIsAuthenticated, setIsLoading } = useAuthStore();

  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true);
      try {
        const { data } = await getSession();

        if (data.session) {
          setIsAuthenticated(true);
          setUser({
            id: data.session.user.id,
            email: data.session.user.email || '',
            role: 'admin', // This would come from your user metadata in a real app
            createdAt: data.session.user.created_at || '',
            updatedAt: data.session.user.updated_at || '',
          });
        } else {
          setIsAuthenticated(false);
          setUser(null);
        }
      } catch (error) {
        console.error('Auth check error:', error);
        setIsAuthenticated(false);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [setIsAuthenticated, setIsLoading, setUser]);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/buses" element={<BusesPage />} />
        <Route path="/drivers" element={<DriversPage />} />
        <Route path="/tours" element={<ToursPage />} />
        <Route path="/agencies" element={<AgenciesPage />} />
        <Route path="/maintenance" element={<MaintenancePage />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
