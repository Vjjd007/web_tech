import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import { tools, toolCategories, getToolsByCategory } from '../data/toolsData';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const recentToolIds = ['json-formatter', 'word-counter', 'ai-chat', 'password-generator', 'cgpa-calculator'];
  const recentTools = recentToolIds.map(id => tools.find(t => t.id === id)).filter(Boolean);

  return (
    <DashboardLayout title="Dashboard">
      {/* Welcome Section */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>
          Welcome back, {user?.username || 'Student'}! 👋
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 15 }}>
          Access 100+ powerful tools for studying, coding, and creating.
        </p>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon purple">📊</div>
          <div className="stat-info">
            <h3>100</h3>
            <p>Total Tools</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon green">🤖</div>
          <div className="stat-info">
            <h3>20</h3>
            <p>AI Tools</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon pink">⭐</div>
          <div className="stat-info">
            <h3>7</h3>
            <p>Categories</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon blue">🚀</div>
          <div className="stat-info">
            <h3>Free</h3>
            <p>Forever</p>
          </div>
        </div>
      </div>

      {/* Quick Access */}
      <div className="category-section">
        <div className="category-header">
          <h2>⚡ Quick Access</h2>
        </div>
        <div className="tool-grid">
          {recentTools.map(tool => (
            <div key={tool.id} className="tool-card" onClick={() => navigate(`/tool/${tool.id}`)}>
              <div className={`tool-card-icon ${tool.category}`}>
                <span>{tool.icon}</span>
              </div>
              <h3>{tool.name}</h3>
              <p>{tool.description}</p>
              <div className="tool-card-footer">
                <span className={`tool-category-tag tag-${tool.category}`}>{tool.category}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Category Sections */}
      {toolCategories.map(cat => (
        <div key={cat.id} className="category-section">
          <div className="category-header">
            <h2>{cat.icon} {cat.name}</h2>
            <button className="see-all-link" onClick={() => navigate(`/category/${cat.id}`)}>
              See all {cat.count} tools →
            </button>
          </div>
          <div className="tool-grid">
            {getToolsByCategory(cat.id).slice(0, 4).map(tool => (
              <div key={tool.id} className="tool-card" onClick={() => navigate(`/tool/${tool.id}`)}>
                <div className={`tool-card-icon ${tool.category}`}>
                  <span>{tool.icon}</span>
                </div>
                <h3>{tool.name}</h3>
                <p>{tool.description}</p>
                <div className="tool-card-footer">
                  <span className={`tool-category-tag tag-${tool.category}`}>{tool.category}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </DashboardLayout>
  );
}
