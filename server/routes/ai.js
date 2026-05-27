const express = require('express');
const auth = require('../middleware/auth');
const supabase = require('../services/supabaseClient');
const { randomUUID } = require('crypto');
const router = express.Router();

const AI_API_URL = process.env.AI_API_URL || 'https://api.groq.com/openai/v1/chat/completions';
const AI_MODEL = process.env.AI_MODEL || 'llama-3.3-70b-versatile';

async function callAI(messages, systemPrompt) {
  const apiKey = process.env.AI_API_KEY;
  if (!apiKey || apiKey === 'your_groq_api_key_here') {
    return 'AI API key not configured. Please set AI_API_KEY in server/.env file. Get a free key at https://console.groq.com';
  }
  try {
    const body = {
      model: AI_MODEL,
      messages: [
        { role: 'system', content: systemPrompt || 'You are a helpful AI assistant for students. Be concise, helpful, and accurate.' },
        ...messages.map(m => ({ role: m.role, content: m.content }))
      ],
      temperature: 0.7,
      max_tokens: 2048
    };
    const response = await fetch(AI_API_URL, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    const data = await response.json();
    if (data.error) return `AI Error: ${data.error.message}`;
    return data.choices?.[0]?.message?.content || 'No response from AI.';
  } catch (err) {
    return `AI request failed: ${err.message}`;
  }
}

// Chat with AI
router.post('/chat', auth, async (req, res) => {
  try {
    const { message, chatId, context } = req.body;
    if (!supabase) return res.status(500).json({ error: 'Supabase not configured on server.' });
    const id = chatId || randomUUID();
    let chatPayload = { title: message.substring(0, 50), toolContext: context || 'general', messages: [] };

    if (chatId) {
      const { data: existing, error: existingErr } = await supabase
        .from('user_history')
        .select('*')
        .eq('id', chatId)
        .eq('user_id', req.userId)
        .eq('action', 'ai_chat')
        .limit(1);
      if (existingErr) throw existingErr;
      if (existing && existing.length > 0) {
        chatPayload = existing[0].payload || chatPayload;
      }
    }

    chatPayload.messages = Array.isArray(chatPayload.messages) ? chatPayload.messages : [];
    chatPayload.messages.push({ role: 'user', content: message });
    const aiResponse = await callAI(chatPayload.messages, getSystemPrompt(context));
    chatPayload.messages.push({ role: 'assistant', content: aiResponse });

    const chatRow = {
      id,
      user_id: req.userId,
      tool_id: null,
      action: 'ai_chat',
      payload: chatPayload,
      used_at: new Date().toISOString()
    };
    const { error: upsertErr } = await supabase.from('user_history').upsert(chatRow, { onConflict: 'id' });
    if (upsertErr) throw upsertErr;
    res.json({ response: aiResponse, chatId: id });
  } catch (err) {
    console.error('AI chat error:', err);
    res.status(500).json({ error: 'AI request failed.' });
  }
});

// Get chat history
router.get('/chats', auth, async (req, res) => {
  try {
    if (!supabase) return res.status(500).json({ error: 'Supabase not configured on server.' });
    const { data, error } = await supabase
      .from('user_history')
      .select('*')
      .eq('user_id', req.userId)
      .eq('action', 'ai_chat')
      .order('used_at', { ascending: false })
      .limit(50);
    if (error) throw error;
    const chats = (data || []).map(row => ({
      _id: row.id,
      title: row.payload?.title || 'Chat',
      toolContext: row.payload?.toolContext || 'general',
      createdAt: row.used_at,
      updatedAt: row.used_at
    }));
    res.json({ chats });
  } catch (err) {
    console.error('AI chats list error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

// Get single chat
router.get('/chats/:id', auth, async (req, res) => {
  try {
    if (!supabase) return res.status(500).json({ error: 'Supabase not configured on server.' });
    const { data, error } = await supabase
      .from('user_history')
      .select('*')
      .eq('id', req.params.id)
      .eq('user_id', req.userId)
      .eq('action', 'ai_chat')
      .limit(1);
    if (error) throw error;
    if (!data || data.length === 0) return res.status(404).json({ error: 'Chat not found.' });
    const row = data[0];
    const chat = {
      _id: row.id,
      title: row.payload?.title || 'Chat',
      toolContext: row.payload?.toolContext || 'general',
      messages: row.payload?.messages || [],
      createdAt: row.used_at,
      updatedAt: row.used_at
    };
    res.json({ chat });
  } catch (err) {
    console.error('AI chat fetch error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

// Delete chat
router.delete('/chats/:id', auth, async (req, res) => {
  try {
    if (!supabase) return res.status(500).json({ error: 'Supabase not configured on server.' });
    const { error } = await supabase
      .from('user_history')
      .delete()
      .eq('id', req.params.id)
      .eq('user_id', req.userId)
      .eq('action', 'ai_chat');
    if (error) throw error;
    res.json({ success: true });
  } catch (err) {
    console.error('AI chat delete error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

// AI tool endpoints
router.post('/generate', auth, async (req, res) => {
  try {
    const { prompt, type } = req.body;
    const systemPrompts = {
      essay: 'You are an expert essay writer. Write a well-structured, detailed essay on the given topic.',
      code: 'You are an expert programmer. Generate clean, well-commented code for the given task.',
      debug: 'You are an expert debugger. Analyze the code, find bugs, and provide fixes with explanations.',
      summarize: 'You are a text summarizer. Provide a clear, concise summary of the given text.',
      research: 'You are a research assistant. Provide detailed, well-sourced information on the topic.',
      blog: 'You are a blog writer. Write an engaging, SEO-friendly blog post on the given topic.',
      email: 'You are an email writing assistant. Write a professional, clear email based on the given context.',
      resume: 'You are a resume building expert. Create a professional resume section based on the information.',
      studynotes: 'You are a study notes generator. Create clear, organized study notes on the topic.',
      qa: 'You are a Q&A expert. Answer the question thoroughly and accurately.',
      flashcards: 'You are a flashcard creator. Generate question-answer flashcard pairs in JSON format: [{"q":"...","a":"..."}]',
      interview: 'You are an interview coach. Provide interview questions and model answers for the given role/topic.',
      grammar: 'You are a grammar expert. Fix all grammar, spelling, and punctuation errors in the text. Return only the corrected text.',
      explain: 'You are a code explainer. Explain the code line by line in simple terms.',
      idea: 'You are a creative idea generator. Generate unique, innovative ideas for the given topic.',
      promptgen: 'You are an AI prompt engineer. Generate effective prompts for the given task.',
      homework: 'You are a homework helper. Help solve the problem step by step with clear explanations.',
      pdfanalyze: 'You are a document analyzer. Answer questions based on the provided document content.',
      imageanalyze: 'You are an image analyzer. Describe and answer questions about the image content.'
    };
    const sysPrompt = systemPrompts[type] || systemPrompts.qa;
    const messages = [{ role: 'user', content: prompt }];
    const aiResponse = await callAI(messages, sysPrompt);
    res.json({ response: aiResponse });
  } catch (err) {
    res.status(500).json({ error: 'AI generation failed.' });
  }
});

function getSystemPrompt(context) {
  const prompts = {
    general: 'You are a helpful AI assistant for students. Be concise and accurate.',
    coding: 'You are an expert programming tutor. Help with coding questions with examples.',
    study: 'You are a study assistant. Help students learn effectively.',
    math: 'You are a math tutor. Solve problems step by step.'
  };
  return prompts[context] || prompts.general;
}

module.exports = router;
