const router = require('express').Router();

// Free search strategy:
// 1. First try local trip knowledge (instant, no API needed)
// 2. Fetch live results from free search APIs (no subscription)
// 3. Return structured results

const LOCATIONS = {
  0: 'Atlanta Georgia',
  1: 'Interlaken Switzerland Wilderswil',
  2: 'Schilthorn Lauterbrunnen Switzerland',
  3: 'Grindelwald Switzerland',
  4: 'Zermatt Switzerland',
  5: 'Lucerne Switzerland',
  6: 'Zurich Switzerland',
  7: 'Geneva Switzerland',
};

// Curated local knowledge — instant answers, no API
const LOCAL_KNOWLEDGE = {
  'restaurant hours': `🍽 **Swiss Restaurant Hours**\n\nLunch: 12:00–14:00 (kitchens close sharp)\nDinner: 18:30–21:30 (last orders ~21:00)\nSome close Monday or Tuesday\n\n💡 Always check Google Maps "hours" — many alpine restaurants close off-season between lunch & dinner service.\n\n⚠️ Swiss restaurants are punctual — arrive before kitchen closes!`,

  'fondue': `🧀 **Fondue in Switzerland**\n\nBest spots by location:\n• **Wilderswil/Interlaken**: Restaurant Schuh, Gasthof Bären\n• **Grindelwald**: Restaurant Adler (book ahead!), Hotel Belvedere\n• **Zermatt**: Whymper Stube, Restaurant du Pont\n• **Lucerne**: Rathaus Brauerei, Zunfthaus zu Pfistern\n\n💰 Price: CHF 25–45 per person\n📞 Always book ahead for fondue — it needs prep time!`,

  'vegetarian': `🥗 **Vegetarian Options in Switzerland**\n\nSwitzerland is vegetarian-friendly:\n• Most restaurants have vegetarian options\n• Rösti (potato cake) is often vegetarian\n• Cheese dishes: fondue, raclette, Käseschnitzel\n• Asian/Indian restaurants available in Zurich & Lucerne\n\n🔍 Search "vegetarian [city name]" on Google Maps for specific places`,

  'indian food': `🍛 **Indian Restaurants**\n\n• **Zurich**: Zlata Praha, Indian Paradise, Bombay Dreams (multiple locations)\n• **Lucerne**: Taj Mahal Restaurant, Shahi India\n• **Interlaken**: Indian Curry House\n• **Zermatt**: Limited options — Grampis bar has some Asian food\n\n💡 Zurich has the best selection — plan Indian food for Apr 10!`,

  'travel pass': `🎫 **Swiss Travel Pass Tips**\n\nCovers:\n✅ All SBB trains, buses, trams\n✅ Lake boats (Lucerne, Zurich, Thun, Brienz)\n✅ 500+ museums FREE\n✅ 50% off most mountain railways\n\nDoes NOT cover:\n❌ GoldenPass Express seat reservation (~CHF 10)\n❌ Full Schilthorn cable car (50% discount applies)\n❌ Glacier Express supplement\n\n📱 Show QR code on SBB app — no printing needed`,

  'tipping': `💰 **Tipping in Switzerland**\n\nTipping is NOT expected but appreciated:\n• Restaurants: round up or add 5-10%\n• Taxis: round up to nearest CHF\n• Hotels: CHF 1-2 per bag\n\nService charge is included in all prices. No guilt about not tipping extra!`,

  'chocolate': `🍫 **Best Swiss Chocolate**\n\n• **Läderach**: Fresh chocolate, multiple cities\n• **Lindt**: Zurich museum + everywhere\n• **Sprüngli**: Zurich — legendary Luxemburgerli\n• **Tobler**: Named after the Matterhorn shape!\n• **Local**: Look for "Confiserie" shops in each village\n\n💡 Lindt factory outlet at Kilchberg (Apr 10) — good prices\n⚠️ Duty-free allowance: CHF 300 before VAT applies`,

  'sbb train': `🚂 **SBB Train Tips**\n\n• Swiss Travel Pass = unlimited travel, just show QR\n• Trains run EXACTLY on time — be at platform early\n• Platform (Gleis) shown 5 min before departure\n• Double-decker trains — upstairs for best views\n• Direct connections: Interlaken ↔ Grindelwald (50 min), Bern ↔ Zurich (1h), Bern ↔ Lucerne (1.5h)\n\n📱 SBB app shows real-time delays and platform changes`,

  'currency': `💱 **Money in Switzerland**\n\nCurrency: CHF (Swiss Franc)\n1 CHF ≈ $1.10 USD (check current rate)\n\n• Cards accepted almost everywhere (Visa/MC)\n• Contactless widely available\n• ATMs (Bancomat) at every train station\n• Airport exchange rates are poor — use ATM instead\n\n💡 Keep CHF 50-100 cash for small purchases, cable car tips, market stalls`,
};

function getLocalAnswer(query) {
  const q = query.toLowerCase();
  for (const [key, answer] of Object.entries(LOCAL_KNOWLEDGE)) {
    const keywords = key.split(' ');
    if (keywords.some(kw => q.includes(kw))) return answer;
  }
  return null;
}

// POST /api/search — free search, no subscription required
router.post('/', async (req, res) => {
  const { query, context, dayIndex } = req.body;
  if (!query) return res.status(400).json({ error: 'query required' });

  const location = LOCATIONS[dayIndex] || 'Switzerland';

  // Step 1: Check local knowledge base first
  const localAnswer = getLocalAnswer(query);

  // Step 2: Fetch from free APIs in parallel
  const searchQuery = encodeURIComponent(`${query} ${location} 2025`);
  const ddgUrl = `https://api.duckduckgo.com/?q=${searchQuery}&format=json&no_html=1&skip_disambig=1`;

  try {
    const [ddgRes] = await Promise.allSettled([
      fetch(ddgUrl, { signal: AbortSignal.timeout(5000), headers: { 'Accept-Language': 'en-US' } }),
    ]);

    let webContent = '';

    if (ddgRes.status === 'fulfilled' && ddgRes.value.ok) {
      const ddgData = await ddgRes.value.json();

      // Extract useful content from DDG
      if (ddgData.AbstractText) {
        webContent += `📖 ${ddgData.AbstractText}\n\n`;
      }
      if (ddgData.Answer) {
        webContent += `✅ ${ddgData.Answer}\n\n`;
      }
      if (ddgData.RelatedTopics?.length) {
        const topics = ddgData.RelatedTopics
          .filter(t => t.Text)
          .slice(0, 4)
          .map(t => `• ${t.Text}`)
          .join('\n');
        if (topics) webContent += topics + '\n\n';
      }
    }

    // Build response
    let reply = '';

    if (localAnswer) {
      reply = localAnswer;
      if (webContent) reply += `\n\n---\n🌐 **Web results:**\n${webContent.trim()}`;
    } else if (webContent) {
      reply = `🔍 **Results for "${query}" near ${location.split(' ')[0]}:**\n\n${webContent.trim()}`;
    } else {
      // Fallback — give helpful redirect
      reply = buildFallbackResponse(query, location, dayIndex);
    }

    // Append useful links
    reply += buildUsefulLinks(query, location);

    res.json({ reply: reply.trim() });

  } catch (e) {
    console.error('Search error:', e.message);
    // Even on error, return local knowledge or fallback
    const fallback = localAnswer || buildFallbackResponse(query, location, dayIndex);
    res.json({ reply: fallback + buildUsefulLinks(query, location) });
  }
});

function buildFallbackResponse(query, location, dayIndex) {
  const city = location.split(' ')[0];
  const q = query.toLowerCase();

  if (q.includes('restaurant') || q.includes('food') || q.includes('eat') || q.includes('dinner') || q.includes('lunch')) {
    return `🍽 **Finding restaurants in ${city}**\n\nTry these free options:\n• Google Maps → search "${query}" near ${city}\n• TripAdvisor → "${city} restaurants"\n• TheFork app (available in Switzerland)\n\n💡 Swiss tip: Book dinner ahead — popular spots fill by 7 PM!\nLunch: 12:00–14:00 · Dinner: 18:30–21:30`;
  }
  if (q.includes('train') || q.includes('sbb') || q.includes('rail')) {
    return `🚂 **Train options in Switzerland**\n\nBest source:\n• sbb.ch or SBB app → Journey Planner\n• Your Swiss Travel Pass covers almost all routes\n• Real-time delays: sbb.ch/en/timetable\n\n💡 Trains in Switzerland run to the minute — be on the platform 2 min early!`;
  }
  if (q.includes('weather') || q.includes('rain') || q.includes('snow')) {
    return `🌤 **Weather**\n\nBest free sources:\n• MeteoSwiss app (official Swiss weather)\n• meteoswiss.admin.ch\n• Mountain forecasts update 4x daily\n\n💡 In April: valley temps 8–15°C, summits -5 to 2°C`;
  }
  return `🔍 **"${query}"**\n\nNo instant results found. Try:\n• Google: "${query} ${city} Switzerland"\n• TripAdvisor for restaurants/activities\n• SBB app for train times\n• MeteoSwiss app for weather`;
}

function buildUsefulLinks(query, location) {
  const q = query.toLowerCase();
  const city = location.split(' ')[0];
  const encoded = encodeURIComponent(`${query} ${city} Switzerland`);
  const links = [];

  if (q.includes('restaurant') || q.includes('food') || q.includes('eat') || q.includes('cafe') || q.includes('dinner') || q.includes('lunch') || q.includes('fondue') || q.includes('indian') || q.includes('vegetarian')) {
    links.push(`🗺 [Google Maps](https://www.google.com/maps/search/${encodeURIComponent(query+' '+city)})`);
    links.push(`⭐ [TripAdvisor](https://www.tripadvisor.com/Search?q=${encoded})`);
  }
  if (q.includes('train') || q.includes('sbb') || q.includes('rail') || q.includes('timetable')) {
    links.push(`🚂 [SBB Journey Planner](https://www.sbb.ch/en/buying/pages/fahrplan/fahrplan.xhtml)`);
  }
  if (q.includes('weather') || q.includes('forecast')) {
    links.push(`📡 [MeteoSwiss](https://www.meteoswiss.admin.ch)`);
  }

  if (!links.length) {
    links.push(`🔍 [Google Search](https://www.google.com/search?q=${encoded})`);
  }

  return links.length ? `\n\n${links.join(' · ')}` : '';
}

module.exports = router;
