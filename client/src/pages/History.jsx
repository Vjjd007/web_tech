import { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { getHistory, clearHistory } from '../services/api';

export default function History() {
  const [toolHistory, setToolHistory] = useState([]);
  const [chatHistory, setChatHistory] = useState([]);
  const [tab, setTab] = useState('tools');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getHistory()
      .then(res => {
        setToolHistory(res.data.toolHistory || []);
        setChatHistory(res.data.chatHistory || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleClear = async () => {
    if (window.confirm('Clear all tool history?')) {
      await clearHistory();
      setToolHistory([]);
    }
  };

  const formatTime = (date) => {
    const d = new Date(date);
    return d.toLocaleDateString() + ' ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <DashboardLayout title="History">
      <div className="page-header">
        <h1>📜 History</h1>
        <p>Track your tool usage and AI conversations</p>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div className="tabs">
          <button className={`tab ${tab === 'tools' ? 'active' : ''}`} onClick={() => setTab('tools')}>Tool Usage</button>
          <button className={`tab ${tab === 'chats' ? 'active' : ''}`} onClick={() => setTab('chats')}>AI Chats</button>
        </div>
        {tab === 'tools' && toolHistory.length > 0 && (
          <button className="btn btn-ghost" onClick={handleClear} style={{ color: 'var(--accent-red)' }}>Clear History</button>
        )}
      </div>

      {loading ? (
        <div className="loading-spinner" />
      ) : tab === 'tools' ? (
        <div className="history-list">
          {toolHistory.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">📜</div>
              <h3>No History Yet</h3>
              <p>Start using tools and your history will appear here.</p>
            </div>
          ) : toolHistory.map((item, idx) => (
            <div key={idx} className="history-item">
              <div className="history-item-left">
                <div className={`history-icon stat-icon purple`}>🔧</div>
                <div className="history-info">
                  <h4>{item.toolName}</h4>
                  <p>{item.category}</p>
                </div>
              </div>
              <span className="history-time">{formatTime(item.usedAt)}</span>
            </div>
          ))}
        </div>
      ) : (
        <div className="history-list">
          {chatHistory.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">💬</div>
              <h3>No AI Chats</h3>
              <p>Start chatting with the AI assistant.</p>
            </div>
          ) : chatHistory.map((chat, idx) => (
            <div key={idx} className="history-item">
              <div className="history-item-left">
                <div className="history-icon stat-icon green">🤖</div>
                <div className="history-info">
                  <h4>{chat.title}</h4>
                  <p>{chat.toolContext}</p>
                </div>
              </div>
              <span className="history-time">{formatTime(chat.updatedAt)}</span>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
