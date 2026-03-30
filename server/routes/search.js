const router = require('express').Router();

// POST /api/search — trip-aware search using Claude with web search tool
router.post('/', async (req, res) => {
  const { query, context } = req.body;
  if (!query) return res.status(400).json({ error: 'query required' });

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'ANTHROPIC_API_KEY not configured' });

  const systemPrompt = `You are a Switzerland trip search assistant for a family vacation in April 2026. The two families are visiting: Interlaken/Wilderswil (Apr 5-6), Grindelwald (Apr 7), Zermatt/Tasch (Apr 8), Lucerne (Apr 9), Zurich (Apr 10).

When searching for restaurants, always include:
- Opening hours and closing times
- Price range (CHF)
- Whether it's family-friendly / good for kids
- Distance from the main tourist area
- Whether booking is recommended

For train queries, mention SBB (Swiss Federal Railways) and note that the Swiss Travel Pass covers most routes.

Current context: ${context || 'General trip query'}

Be concise and practical. Format results clearly with emoji. If multiple options, give top 3-4. Always mention if something needs advance booking.`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 1500,
        system: systemPrompt,
        tools: [{
          type: 'web_search_20250305',
          name: 'web_search',
        }],
        messages: [{ role: 'user', content: query }],
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      return res.status(response.status).json({ error: data.error?.message || 'API error', detail: JSON.stringify(data).substring(0, 300) });
    }

    // Extract text from response (may include tool use blocks)
    const text = data.content
      ?.filter(b => b.type === 'text')
      .map(b => b.text)
      .join('\n') || '';

    res.json({ reply: text, usage: data.usage });
  } catch (e) {
    console.error('Search error:', e.message);
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
