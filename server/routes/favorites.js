const express = require('express');
const auth = require('../middleware/auth');
const supabase = require('../services/supabaseClient');
const { randomUUID } = require('crypto');
const router = express.Router();

// Get favorites
router.get('/', auth, async (req, res) => {
  try {
    if (!supabase) return res.status(500).json({ error: 'Supabase not configured on server.' });
    const { data, error } = await supabase
      .from('user_history')
      .select('*')
      .eq('user_id', req.userId)
      .eq('action', 'favorite')
      .order('used_at', { ascending: false });
    if (error) throw error;
    const favorites = (data || []).map(row => ({
      id: row.id,
      userId: row.user_id,
      toolId: row.tool_id,
      toolName: row.payload?.toolName || row.payload?.tool_name || 'Tool',
      category: row.payload?.category || null,
      addedAt: row.used_at
    }));
    res.json({ favorites });
  } catch (err) {
    console.error('Favorites GET error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

// Add favorite
router.post('/', auth, async (req, res) => {
  try {
    const { toolId, toolName, category } = req.body;
    if (!toolId || !toolName) return res.status(400).json({ error: 'Tool details are required.' });
    if (!supabase) return res.status(500).json({ error: 'Supabase not configured on server.' });

    const { data: existing, error: existingError } = await supabase
      .from('user_history')
      .select('id')
      .eq('user_id', req.userId)
      .eq('tool_id', toolId)
      .eq('action', 'favorite')
      .limit(1);
    if (existingError) throw existingError;
    if (existing && existing.length > 0) return res.status(400).json({ error: 'Already favorited.' });

    const favorite = {
      id: randomUUID(),
      user_id: req.userId,
      tool_id: toolId,
      action: 'favorite',
      payload: { toolName, category: category || null },
      used_at: new Date().toISOString()
    };
    const { data, error } = await supabase.from('user_history').insert(favorite).select('*').single();
    if (error) throw error;
    res.json({ favorite: {
      id: data.id,
      userId: data.user_id,
      toolId: data.tool_id,
      toolName: data.payload?.toolName || toolName,
      category: data.payload?.category || category || null,
      addedAt: data.used_at
    } });
  } catch (err) {
    console.error('Favorites POST error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

// Remove favorite
router.delete('/:toolId', auth, async (req, res) => {
  try {
    if (!supabase) return res.status(500).json({ error: 'Supabase not configured on server.' });
    const { error } = await supabase
      .from('user_history')
      .delete()
      .eq('user_id', req.userId)
      .eq('tool_id', req.params.toolId)
      .eq('action', 'favorite');
    if (error) throw error;
    res.json({ success: true });
  } catch (err) {
    console.error('Favorites DELETE error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

module.exports = router;
