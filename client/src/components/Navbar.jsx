import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { searchTools } from '../data/toolsData';

export default function Navbar({ onMenuToggle, title }) {
  const { user, darkMode, toggleDarkMode } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearch, setShowSearch] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (q) => {
    setSearchQuery(q);
    if (q.length > 1) {
      setSearchResults(searchTools(q).slice(0, 8));
      setShowSearch(true);
    } else {
      setSearchResults([]);
      setShowSearch(false);
    }
  };

  const goToTool = (toolId) => {
    navigate(`/tool/${toolId}`);
    setSearchQuery('');
    setShowSearch(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <button className="mobile-menu-btn" onClick={onMenuToggle}>☰</button>
        <h1>{title || 'Dashboard'}</h1>
      </div>
      <div style={{ position: 'relative', flex: '0 1 400px' }}>
        <div className="search-bar">
          <span>🔍</span>
          <input
            type="text"
            placeholder="Search 100+ tools..."
            value={searchQuery}
            onChange={e => handleSearch(e.target.value)}
            onBlur={() => setTimeout(() => setShowSearch(false), 200)}
            onFocus={() => searchQuery.length > 1 && setShowSearch(true)}
          />
        </div>
        {showSearch && searchResults.length > 0 && (
          <div style={{
            position: 'absolute', top: '100%', left: 0, right: 0, marginTop: 8,
            background: 'var(--bg-card)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-lg)',
            zIndex: 100, overflow: 'hidden'
          }}>
            {searchResults.map(tool => (
              <div
                key={tool.id}
                onClick={() => goToTool(tool.id)}
                style={{
                  padding: '12px 16px', cursor: 'pointer', display: 'flex',
                  alignItems: 'center', gap: 12, transition: 'var(--transition-fast)',
                  borderBottom: '1px solid var(--border)'
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-tertiary)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <span style={{ fontSize: 20 }}>{tool.icon}</span>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{tool.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{tool.category}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="navbar-right">
        <button className="theme-toggle" onClick={toggleDarkMode} title="Toggle theme">
          {darkMode ? '☀️' : '🌙'}
        </button>
        <button className="notif-btn" title="Notifications">🔔</button>
        <div className="user-menu" onClick={() => navigate('/settings')}>
          <div className="user-avatar">
            {user?.username?.[0]?.toUpperCase() || 'U'}
          </div>
          <div className="user-menu-info">
            <div className="name">{user?.username || 'User'}</div>
            <div className="role">Student</div>
          </div>
        </div>
      </div>
    </nav>
  );
}
