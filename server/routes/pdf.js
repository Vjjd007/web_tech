const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const auth = require('../middleware/auth');
const router = express.Router();

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage, limits: { fileSize: 20 * 1024 * 1024 } });

// Upload and parse PDF
router.post('/upload', auth, upload.single('pdf'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded.' });
    const pdfParse = require('pdf-parse');
    const dataBuffer = fs.readFileSync(req.file.path);
    const data = await pdfParse(dataBuffer);
    res.json({
      text: data.text,
      pages: data.numpages,
      info: data.info,
      filename: req.file.originalname
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to parse PDF: ' + err.message });
  }
});

// Ask question about PDF content
router.post('/ask', auth, async (req, res) => {
  try {
    const { question, pdfText } = req.body;
    if (!question || !pdfText) {
      return res.status(400).json({ error: 'Question and PDF text required.' });
    }
    const aiKey = process.env.AI_API_KEY;
    if (!aiKey || aiKey === 'your_groq_api_key_here') {
      return res.json({ answer: 'AI API key not configured. Set AI_API_KEY in .env' });
    }
    const aiUrl = process.env.AI_API_URL || 'https://api.groq.com/openai/v1/chat/completions';
    const aiModel = process.env.AI_MODEL || 'llama-3.3-70b-versatile';
    const response = await fetch(aiUrl, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${aiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: aiModel,
        messages: [
          { role: 'system', content: `You are a document analyzer. Answer questions based ONLY on this document:\n\n${pdfText.substring(0, 8000)}` },
          { role: 'user', content: question }
        ],
        temperature: 0.3, max_tokens: 1024
      })
    });
    const data = await response.json();
    res.json({ answer: data.choices?.[0]?.message?.content || 'No answer generated.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to analyze PDF.' });
  }
});

module.exports = router;
