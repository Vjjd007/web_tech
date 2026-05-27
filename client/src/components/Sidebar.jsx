import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: '🏠', path: '/dashboard' },
  { id: 'ai-chat', label: 'AI Assistant', icon: '🤖', path: '/ai-chat' },
  { type: 'divider', label: 'Categories' },
  { id: 'student', label: 'Student Tools', icon: '🎓', path: '/category/student' },
  { id: 'developer', label: 'Developer Tools', icon: '💻', path: '/category/developer' },
  { id: 'text', label: 'Text Tools', icon: '📝', path: '/category/text' },
  { id: 'file', label: 'File Tools', icon: '📁', path: '/category/file' },
  { id: 'image', label: 'Image Tools', icon: '🖼️', path: '/category/image' },
  { id: 'seo', label: 'SEO Tools', icon: '🔍', path: '/category/seo' },
  { id: 'ai-tools', label: 'AI Tools', icon: '✨', path: '/category/ai' },
  { type: 'divider', label: 'Account' },
  { id: 'history', label: 'History', icon: '📜', path: '/history' },
  { id: 'favorites', label: 'Favorites', icon: '⭐', path: '/favorites' },
  { id: 'settings', label: 'Settings', icon: '⚙️', path: '/settings' },
];

export default function Sidebar({ isOpen, onClose }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  const handleNav = (path) => {
    navigate(path);
    if (onClose) onClose();
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      {isOpen && <div className="sidebar-overlay" onClick={onClose} style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 99,
        display: window.innerWidth <= 768 ? 'block' : 'none'
      }} />}
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">S</div>
          <div>
            <h2>StudentHub</h2>
            <span>100+ Tools</span>
          </div>
        </div>
        <nav className="sidebar-nav">
          {menuItems.map((item, idx) => {
            if (item.type === 'divider') {
              return <div key={idx} className="sidebar-section-title">{item.label}</div>;
            }
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.id}
                className={`sidebar-item ${isActive ? 'active' : ''}`}
                onClick={() => handleNav(item.path)}
              >
                <span className="icon">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
        <div className="sidebar-footer">
          <button className="sidebar-item" onClick={handleLogout} style={{ color: '#FF6B6B' }}>
            <span className="icon">🚪</span>
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
