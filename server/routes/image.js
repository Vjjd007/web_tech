const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const auth = require('../middleware/auth');
const router = express.Router();

const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

// Upload and OCR image
router.post('/ocr', auth, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No image uploaded.' });
    const Tesseract = require('tesseract.js');
    const { data: { text } } = await Tesseract.recognize(req.file.path, 'eng');
    res.json({ text, filename: req.file.originalname });
  } catch (err) {
    res.status(500).json({ error: 'OCR failed: ' + err.message });
  }
});

// Ask question about image text
router.post('/ask', auth, async (req, res) => {
  try {
    const { question, imageText } = req.body;
    if (!question || !imageText) {
      return res.status(400).json({ error: 'Question and image text required.' });
    }
    const aiKey = process.env.AI_API_KEY;
    if (!aiKey || aiKey === 'your_groq_api_key_here') {
      return res.json({ answer: 'AI API key not configured.' });
    }
    const aiUrl = process.env.AI_API_URL || 'https://api.groq.com/openai/v1/chat/completions';
    const aiModel = process.env.AI_MODEL || 'llama-3.3-70b-versatile';
    const response = await fetch(aiUrl, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${aiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: aiModel,
        messages: [
          { role: 'system', content: `Analyze this text extracted from an image and answer questions:\n\n${imageText}` },
          { role: 'user', content: question }
        ],
        temperature: 0.3, max_tokens: 1024
      })
    });
    const data = await response.json();
    res.json({ answer: data.choices?.[0]?.message?.content || 'No answer generated.' });
  } catch (err) {
    res.status(500).json({ error: 'Image analysis failed.' });
  }
});

module.exports = router;
