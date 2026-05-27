import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import ToolPage from './pages/ToolPage';
import AIChat from './pages/AIChat';
import History from './pages/History';
import Favorites from './pages/Favorites';
import Settings from './pages/Settings';
import CategoryPage from './pages/CategoryPage';

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading-spinner" style={{marginTop: '40vh'}}></div>;
  return user ? children : <Navigate to="/login" />;
}

function PublicRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading-spinner" style={{marginTop: '40vh'}}></div>;
  return !user ? children : <Navigate to="/dashboard" />;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />
      <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      <Route path="/tool/:toolId" element={<PrivateRoute><ToolPage /></PrivateRoute>} />
      <Route path="/ai-chat" element={<PrivateRoute><AIChat /></PrivateRoute>} />
      <Route path="/ai-chat/:chatId" element={<PrivateRoute><AIChat /></PrivateRoute>} />
      <Route path="/category/:categoryId" element={<PrivateRoute><CategoryPage /></PrivateRoute>} />
      <Route path="/history" element={<PrivateRoute><History /></PrivateRoute>} />
      <Route path="/favorites" element={<PrivateRoute><Favorites /></PrivateRoute>} />
      <Route path="/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
      <Route path="/" element={<Navigate to="/dashboard" />} />
      <Route path="*" element={<Navigate to="/dashboard" />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}
