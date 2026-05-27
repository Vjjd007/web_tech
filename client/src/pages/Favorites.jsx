import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import { getFavorites, removeFavorite } from '../services/api';

export default function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getFavorites()
      .then(res => setFavorites(res.data.favorites || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleRemove = async (toolId) => {
    await removeFavorite(toolId);
    setFavorites(prev => prev.filter(f => f.toolId !== toolId));
  };

  return (
    <DashboardLayout title="Favorites">
      <div className="page-header">
        <h1>⭐ Favorite Tools</h1>
        <p>Your bookmarked tools for quick access</p>
      </div>

      {loading ? <div className="loading-spinner" /> : favorites.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">⭐</div>
          <h3>No Favorites Yet</h3>
          <p>Star your favorite tools and they'll appear here for quick access.</p>
        </div>
      ) : (
        <div className="tool-grid">
          {favorites.map(fav => (
            <div key={fav.toolId} className="tool-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <h3 style={{ cursor: 'pointer' }} onClick={() => navigate(`/tool/${fav.toolId}`)}>{fav.toolName}</h3>
                <button className="fav-btn active" onClick={() => handleRemove(fav.toolId)}>★</button>
              </div>
              <div className="tool-card-footer">
                <span className={`tool-category-tag tag-${fav.category}`}>{fav.category}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
