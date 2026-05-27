const express = require('express');
const auth = require('../middleware/auth');
const supabase = require('../services/supabaseClient');
const { randomUUID } = require('crypto');
const router = express.Router();

// Log tool usage
router.post('/use', auth, async (req, res) => {
  try {
    const { toolId, toolName, category, input, output } = req.body;
    if (!supabase) return res.status(500).json({ error: 'Supabase not configured on server.' });
    const history = {
      id: randomUUID(),
      user_id: req.userId,
      tool_id: toolId || null,
      action: 'tool_use',
      payload: { toolName, category, input, output },
      used_at: new Date().toISOString()
    };
    const { data, error } = await supabase.from('user_history').insert(history).select('*').single();
    if (error) throw error;
    res.json({ success: true, history: data });
  } catch (err) {
    console.error('Tool use log error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

// Get tool usage stats
router.get('/stats', auth, async (req, res) => {
  try {
    if (!supabase) return res.status(500).json({ error: 'Supabase not configured on server.' });
    const { data: rows, error } = await supabase
      .from('user_history')
      .select('*')
      .eq('user_id', req.userId)
      .eq('action', 'tool_use')
      .order('used_at', { ascending: false })
      .limit(100);
    if (error) throw error;
    const totalUsage = rows.length;
    const recentTools = rows.slice(0, 10).map(row => ({
      ...row,
      ...row.payload,
      userId: row.user_id,
      usedAt: row.used_at,
      category: row.payload?.category || null,
      toolName: row.payload?.toolName || null
    }));
    const categoryCount = rows.reduce((acc, row) => {
      const category = row.payload?.category || 'general';
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {});
    const categoryStats = Object.entries(categoryCount).map(([key, count]) => ({ _id: key, count })).sort((a, b) => b.count - a.count);
    res.json({ totalUsage, recentTools, categoryStats });
  } catch (err) {
    console.error('Tool stats error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

module.exports = router;
