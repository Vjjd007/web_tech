const express = require('express');
const auth = require('../middleware/auth');
const supabase = require('../services/supabaseClient');
const router = express.Router();

// Get all history (tool usage + chat placeholders)
router.get('/', auth, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;
    if (!supabase) return res.status(500).json({ error: 'Supabase not configured on server.' });

    const { data: rows, error } = await supabase
      .from('user_history')
      .select('*')
      .eq('user_id', req.userId)
      .in('action', ['tool_use', 'ai_chat'])
      .order('used_at', { ascending: false })
      .limit(limit);
    if (error) throw error;

    // Map to frontend shape
    const toolHistory = (rows || []).filter(r => r.action === 'tool_use').map(r => {
      let payload = {};
      try { payload = r.payload || {}; } catch (_) { payload = {}; }
      return {
        id: r.id,
        toolId: r.tool_id,
        toolName: payload.toolName || payload.name || 'Tool',
        category: payload.category || payload.type || 'General',
        usedAt: r.used_at || r.created_at || null,
        raw: payload
      };
    });

    const chatHistory = (rows || []).filter(r => r.action === 'ai_chat').map(r => ({
      _id: r.id,
      title: r.payload?.title || 'Chat',
      toolContext: r.payload?.toolContext || 'general',
      createdAt: r.used_at,
      updatedAt: r.used_at
    }));

    res.json({ toolHistory, chatHistory });
  } catch (err) {
    console.error('History GET Error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

// Clear history for user
router.delete('/clear', auth, async (req, res) => {
  try {
    if (!supabase) return res.status(500).json({ error: 'Supabase not configured on server.' });
    const { error } = await supabase.from('user_history').delete().eq('user_id', req.userId);
    if (error) throw error;
    res.json({ success: true });
  } catch (err) {
    console.error('History Clear Error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

module.exports = router;
