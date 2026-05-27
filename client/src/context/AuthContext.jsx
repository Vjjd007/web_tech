import { createContext, useContext, useState, useEffect } from 'react';
import { getMe } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('darkMode') === 'true');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  useEffect(() => {
    let mounted = true;

    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return () => { mounted = false; };
    }

    getMe().then(({ data }) => {
      if (!mounted) return;
      setUser(data.user);
      setLoading(false);
    }).catch(() => {
      localStorage.removeItem('token');
      if (mounted) {
        setUser(null);
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
    };
  }, []);

  const loginUser = (userData, token) => {
    localStorage.setItem('token', token);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const toggleDarkMode = () => setDarkMode(prev => !prev);

  return (
    <AuthContext.Provider value={{ user, setUser, loading, loginUser, logout, darkMode, toggleDarkMode }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
