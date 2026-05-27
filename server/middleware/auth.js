const supabase = require('../services/supabaseClient');

module.exports = async function(req, res, next) {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }
  try {
    if (!supabase) {
      return res.status(500).json({ error: 'Supabase not configured on server.' });
    }
    const { data, error } = await supabase.auth.getUser(token);
    if (error || !data?.user) {
      return res.status(401).json({ error: 'Invalid or expired token.' });
    }
    req.userId = data.user.id;
    req.user = data.user;
    next();
  } catch (err) {
    console.error('Auth middleware error:', err);
    res.status(401).json({ error: 'Invalid or expired token.' });
  }
};
