import { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import { sendAIChat, getAIChat, getAIChats } from '../services/api';

export default function AIChat() {
  const { chatId: urlChatId } = useParams();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [chatId, setChatId] = useState(urlChatId || null);
  const [chatList, setChatList] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (urlChatId) {
      getAIChat(urlChatId).then(res => {
        setMessages(res.data.chat.messages || []);
        setChatId(urlChatId);
      }).catch(() => {});
    }
  }, [urlChatId]);

  useEffect(() => {
    getAIChats().then(res => setChatList(res.data.chats || [])).catch(() => {});
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMsg = { role: 'user', content: input.trim() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);
    try {
      const res = await sendAIChat({ message: userMsg.content, chatId, context: 'general' });
      setChatId(res.data.chatId);
      setMessages(prev => [...prev, { role: 'assistant', content: res.data.response }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, something went wrong. Please try again.' }]);
    }
    setLoading(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  const newChat = () => { setMessages([]); setChatId(null); };

  return (
    <DashboardLayout title="AI Assistant">
      <div style={{ display: 'flex', gap: 20, height: 'calc(100vh - 140px)' }}>
        {/* Chat History Panel */}
        <div style={{
          width: 260, background: 'var(--bg-card)', border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)', display: showHistory || window.innerWidth > 768 ? 'flex' : 'none',
          flexDirection: 'column', overflow: 'hidden', flexShrink: 0
        }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: 14, fontWeight: 700 }}>Chat History</h3>
            <button className="btn btn-ghost" onClick={newChat} style={{ fontSize: 12 }}>+ New</button>
          </div>
          <div style={{ flex: 1, overflow: 'auto', padding: 8 }}>
            {chatList.map(c => (
              <div key={c._id}
                onClick={() => { setChatId(c._id); getAIChat(c._id).then(r => setMessages(r.data.chat.messages || [])).catch(() => {}); }}
                style={{
                  padding: '10px 12px', borderRadius: 'var(--radius-sm)', cursor: 'pointer',
                  fontSize: 13, color: chatId === c._id ? 'var(--primary)' : 'var(--text-secondary)',
                  background: chatId === c._id ? 'var(--primary-glow)' : 'transparent',
                  marginBottom: 2, transition: 'var(--transition-fast)', overflow: 'hidden',
                  textOverflow: 'ellipsis', whiteSpace: 'nowrap'
                }}
              >
                💬 {c.title}
              </div>
            ))}
            {chatList.length === 0 && (
              <p style={{ padding: 16, fontSize: 13, color: 'var(--text-muted)', textAlign: 'center' }}>No chats yet</p>
            )}
          </div>
        </div>

        {/* Main Chat */}
        <div className="chat-container" style={{ flex: 1 }}>
          <div className="chat-header">
            <h2>🤖 AI Assistant</h2>
            <button className="btn btn-ghost" onClick={newChat}>New Chat</button>
          </div>
          <div className="chat-messages">
            {messages.length === 0 && (
              <div className="empty-state">
                <div className="empty-state-icon">🤖</div>
                <h3>Start a Conversation</h3>
                <p>Ask me anything! I can help with coding, studying, writing, and more.</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center', marginTop: 20 }}>
                  {['Explain React hooks', 'Write an essay about AI', 'Help me with calculus', 'Debug my Python code'].map(s => (
                    <button key={s} className="btn btn-secondary" onClick={() => setInput(s)} style={{ fontSize: 12 }}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {messages.map((msg, idx) => (
              <div key={idx} className={`chat-message ${msg.role}`}>
                <div className="msg-avatar">
                  {msg.role === 'user' ? '👤' : '🤖'}
                </div>
                <div className="msg-bubble">{msg.content}</div>
              </div>
            ))}
            {loading && (
              <div className="chat-message assistant">
                <div className="msg-avatar">🤖</div>
                <div className="msg-bubble">
                  <div className="typing-indicator">
                    <span></span><span></span><span></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          <div className="chat-input-area">
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              rows={1}
            />
            <button className="send-btn" onClick={sendMessage} disabled={!input.trim() || loading}>
              ➤
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
