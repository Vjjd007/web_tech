const express = require('express');
const jwt = require('jsonwebtoken');
const supabase = require('../services/supabaseClient');
const auth = require('../middleware/auth');
const router = express.Router();

// Signup using Supabase Auth + public profile row
router.post('/signup', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'All fields are required.' });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters.' });
    }
    if (!supabase) return res.status(500).json({ error: 'Supabase not configured on server.' });

    const { data: authData, error: createUserErr } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { username }
    });
    if (createUserErr) {
      console.error('Supabase auth createUser error:', createUserErr);
      if ((createUserErr.message || '').toLowerCase().includes('already registered')) {
        return res.status(400).json({ error: 'User already exists.' });
      }
      return res.status(500).json({ error: 'Failed to create user.' });
    }

    const id = authData.user.id;
    const createdAt = authData.user.created_at || new Date().toISOString();
    const profilePayload = { id, email, username, created_at: createdAt };
    const { error: profileErr } = await supabase.from('profiles').upsert(profilePayload);
    if (profileErr) {
      console.error('Supabase profile upsert error:', profileErr);
      return res.status(500).json({ error: 'Failed to create profile.' });
    }

    const token = jwt.sign({ userId: id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({
      token,
      user: { id, username, email, profileImage: null, createdAt }
    });
  } catch (err) {
    console.error('Signup Error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'All fields are required.' });
    if (!supabase) return res.status(500).json({ error: 'Supabase not configured on server.' });

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error || !data?.user) return res.status(400).json({ error: 'Invalid credentials.' });

    const { data: profileRows, error: profileErr } = await supabase
      .from('profiles')
      .select('id,email,username,profile_image,created_at')
      .eq('id', data.user.id)
      .limit(1);
    if (profileErr) throw profileErr;
    const profile = profileRows && profileRows[0] ? profileRows[0] : null;

    const token = jwt.sign({ userId: data.user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: data.user.id, username: profile?.username || data.user.user_metadata?.username || '', email: profile?.email || data.user.email, profileImage: profile?.profile_image || null, createdAt: profile?.created_at || data.user.created_at } });
  } catch (err) {
    console.error('Login Error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

// Get current user
router.get('/me', auth, async (req, res) => {
  try {
    if (!supabase) return res.status(500).json({ error: 'Supabase not configured on server.' });
    const { data, error } = await supabase.from('profiles').select('id,email,username,profile_image,created_at').eq('id', req.userId).limit(1);
    if (error) throw error;
    if (!data || data.length === 0) return res.status(404).json({ error: 'User not found.' });
    res.json({ user: data[0] });
  } catch (err) {
    console.error('Get Me Error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

// Update profile
router.put('/profile', auth, async (req, res) => {
  try {
    const { username, profileImage, darkMode, notifications } = req.body;
    const updates = {};
    if (username) updates.username = username;
    if (profileImage !== undefined) updates.profile_image = profileImage;
    if (darkMode !== undefined) updates.dark_mode = darkMode;
    if (notifications !== undefined) updates.notifications = notifications;
    if (!supabase) return res.status(500).json({ error: 'Supabase not configured on server.' });
    const { data, error } = await supabase.from('profiles').update(updates).eq('id', req.userId).select('id,email,username,profile_image,created_at').limit(1);
    if (error) throw error;
    res.json({ user: data && data[0] ? data[0] : null });
  } catch (err) {
    console.error('Update Profile Error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

module.exports = router;
