import { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import { updateProfile } from '../services/api';

export default function Settings() {
  const { user, setUser, darkMode, toggleDarkMode, logout } = useAuth();
  const [username, setUsername] = useState(user?.username || '');
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState('');

  const saveProfile = async () => {
    setSaving(true);
    try {
      const res = await updateProfile({ username });
      setUser(res.data.user);
      setToast('Profile updated!');
      setTimeout(() => setToast(''), 3000);
    } catch (err) {
      setToast('Failed to update profile.');
      setTimeout(() => setToast(''), 3000);
    }
    setSaving(false);
  };

  return (
    <DashboardLayout title="Settings">
      <div className="page-header">
        <h1>⚙️ Settings</h1>
        <p>Manage your account and preferences</p>
      </div>

      <div className="settings-section">
        <h3>Profile</h3>
        <div className="setting-row">
          <div className="setting-label">
            <h4>Username</h4>
            <p>Your display name</p>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              type="text" value={username} onChange={e => setUsername(e.target.value)}
              style={{
                padding: '8px 14px', background: 'var(--bg-tertiary)', border: '1px solid var(--border)',
                borderRadius: 'var(--radius-sm)', color: 'var(--text-primary)', fontSize: 14
              }}
            />
            <button className="btn btn-primary" onClick={saveProfile} disabled={saving}
              style={{ width: 'auto', padding: '8px 20px', fontSize: 13 }}>
              {saving ? '...' : 'Save'}
            </button>
          </div>
        </div>
        <div className="setting-row">
          <div className="setting-label">
            <h4>Email</h4>
            <p>Your account email</p>
          </div>
          <span style={{ color: 'var(--text-secondary)', fontSize: 14 }}>{user?.email}</span>
        </div>
        <div className="setting-row">
          <div className="setting-label">
            <h4>Member Since</h4>
            <p>Account creation date</p>
          </div>
          <span style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
            {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
          </span>
        </div>
      </div>

      <div className="settings-section">
        <h3>Preferences</h3>
        <div className="setting-row">
          <div className="setting-label">
            <h4>Dark Mode</h4>
            <p>Switch between light and dark theme</p>
          </div>
          <div className={`toggle ${darkMode ? 'active' : ''}`} onClick={toggleDarkMode} />
        </div>
      </div>

      <div className="settings-section">
        <h3>Account</h3>
        <div className="setting-row">
          <div className="setting-label">
            <h4>Sign Out</h4>
            <p>Sign out of your account</p>
          </div>
          <button className="btn btn-secondary" onClick={logout} style={{ color: 'var(--accent-red)', borderColor: 'var(--accent-red)' }}>
            Sign Out
          </button>
        </div>
      </div>

      {toast && (
        <div className="notification-toast success">
          ✅ {toast}
        </div>
      )}
    </DashboardLayout>
  );
}
