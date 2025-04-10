import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../lib/store';
import { signIn, signOut, getSession, DEMO_EMAIL, DEMO_PASSWORD } from '../lib/supabaseClient';

export const useAuth = () => {
  const { user, isAuthenticated, isLoading, setUser, setIsAuthenticated, setIsLoading, logout } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true);
      try {
        // Check if we have a session in localStorage
        const storedUser = localStorage.getItem('schiavobus_user');
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          setIsAuthenticated(true);
          setUser(userData);
        } else {
          // Try to get session from Supabase
          const { data } = await getSession();

          if (data.session) {
            const userData = {
              id: data.session.user.id,
              email: data.session.user.email || '',
              role: 'admin', // This would come from your user metadata in a real app
              createdAt: data.session.user.created_at || '',
              updatedAt: data.session.user.updated_at || '',
            };
            setIsAuthenticated(true);
            setUser(userData);
            localStorage.setItem('schiavobus_user', JSON.stringify(userData));
          } else {
            setIsAuthenticated(false);
            setUser(null);
          }
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

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // For demo purposes, check against hardcoded credentials
      if (email === DEMO_EMAIL && password === DEMO_PASSWORD) {
        const userData = {
          id: '1',
          email: DEMO_EMAIL,
          name: 'Admin User',
          role: 'admin',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        setIsAuthenticated(true);
        setUser(userData);
        localStorage.setItem('schiavobus_user', JSON.stringify(userData));
        navigate('/dashboard');
        return { success: true };
      }

      // If not using demo credentials, try Supabase
      const { data, error } = await signIn(email, password);

      if (error) {
        throw error;
      }

      if (data.user) {
        const userData = {
          id: data.user.id,
          email: data.user.email || '',
          role: 'admin', // This would come from your user metadata in a real app
          createdAt: data.user.created_at || '',
          updatedAt: data.user.updated_at || '',
        };

        setIsAuthenticated(true);
        setUser(userData);
        localStorage.setItem('schiavobus_user', JSON.stringify(userData));
        navigate('/dashboard');
        return { success: true };
      }

      return { success: false, error: 'Credenziali non valide' };
    } catch (error: any) {
      console.error('Login error:', error);
      return { success: false, error: error.message || 'Login fallito' };
    } finally {
      setIsLoading(false);
    }
  };

  const logoutUser = async () => {
    setIsLoading(true);
    try {
      await signOut();
      logout();
      localStorage.removeItem('schiavobus_user');
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout: logoutUser,
  };
};
