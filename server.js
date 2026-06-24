require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const API_KEY = process.env.ANTHROPIC_API_KEY;

// ── MIDDLEWARE ──
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.static(path.join(__dirname, 'public')));

// ── HEALTH CHECK ──
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    hasKey: !!API_KEY,
    timestamp: new Date().toISOString()
  });
});

// ── MAIN AI ENDPOINT ──
app.post('/api/chat', async (req, res) => {
  try {
    const { messages, system, max_tokens } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'messages array is required' });
    }

    if (!API_KEY) {
      return res.status(500).json({ error: 'API key not configured on server. Add ANTHROPIC_API_KEY to Railway environment variables.' });
    }

    const body = {
      model: 'claude-sonnet-4-6',
      max_tokens: max_tokens || 1024,
      messages
    };
    if (system) body.system = system;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      console.error('Anthropic error:', err);
      if (response.status === 401) return res.status(401).json({ error: 'Invalid API key. Check your Railway environment variables.' });
      if (response.status === 429) return res.status(429).json({ error: 'Rate limit hit. Wait a moment and try again.' });
      return res.status(response.status).json({ error: err.error?.message || 'Anthropic API error' });
    }

    const data = await response.json();
    const text = data.content?.[0]?.text || '';
    res.json({ text });

  } catch (err) {
    console.error('Server error:', err.message);
    res.status(500).json({ error: 'Server error: ' + err.message });
  }
});

// ── SERVE FRONTEND ──
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ── START ──
app.listen(PORT, () => {
  console.log('');
  console.log('  ✅ GrowthOS Server running on port ' + PORT);
  console.log('  ✅ API key: ' + (API_KEY ? 'configured ✓' : '❌ MISSING — add to Railway env vars'));
  console.log('  ✅ Frontend: http://localhost:' + PORT);
  console.log('');
});
