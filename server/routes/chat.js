const router = require('express').Router();

// POST /api/chat — proxies to Anthropic API server-side (avoids CORS)
router.post('/', async (req, res) => {
  const { messages, systemPrompt } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'messages array required' });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.error('ANTHROPIC_API_KEY not set');
    return res.status(500).json({ error: 'ANTHROPIC_API_KEY not configured on server' });
  }

  try {
    console.log(`Chat: ${messages.length} msgs, key: ${apiKey.substring(0,12)}...`);

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 1000,
        system: systemPrompt || 'You are a helpful Switzerland trip assistant.',
        messages,
      }),
    });

    const responseText = await response.text();
    console.log(`Anthropic status: ${response.status}, body: ${responseText.substring(0,200)}`);

    if (!response.ok) {
      return res.status(response.status).json({
        error: 'Anthropic API error',
        status: response.status,
        detail: responseText.substring(0, 500),
      });
    }

    const data = JSON.parse(responseText);
    const text = data.content?.[0]?.text || '';
    res.json({ reply: text });

  } catch (e) {
    console.error('Chat proxy error:', e.message);
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
