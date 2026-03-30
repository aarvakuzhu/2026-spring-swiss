const router = require('express').Router();

const RESTAURANTS = {
  1: {
    title: 'Wilderswil & Interlaken', hotels: 'Alpenrose Hotel, Wilderswil',
    places: [
      { name: 'Gasthof Bären', type: '🧀 Swiss', price: 'CHF 20–35', note: 'Classic Swiss, excellent cheese fondue, 2 min from Alpenrose hotel', kids: true, book: false, maps: 'https://maps.google.com/?q=Gasthof+Bären+Wilderswil+Switzerland' },
      { name: 'India Village Interlaken', type: '🍛 Indian', price: 'CHF 22–35', note: 'Best Indian in Interlaken — butter chicken highly rated, great for families', kids: true, book: false, maps: 'https://maps.google.com/?q=India+Village+Restaurant+Interlaken+Switzerland' },
      { name: 'Little Thai', type: '🍜 Thai', price: 'CHF 18–27', note: 'Top-rated Thai, Hauptstrasse 19 Matten. Great for a group of 8. Visited by family of 7 with kids in April 2025', kids: true, book: false, maps: 'https://maps.google.com/?q=Little+Thai+Interlaken+Switzerland' },
      { name: 'Layaly Beirut', type: '🥗 Lebanese', price: 'CHF 15–30', note: 'Mezze, hummus, falafel, kebab — fresh and healthy, good for vegetarians too', kids: true, book: true, maps: 'https://maps.google.com/?q=Layaly+Beirut+Interlaken+Switzerland' },
      { name: 'Hüsi Bierhaus', type: '🍺 Swiss Pub', price: 'CHF 20–35', note: 'Lively atmosphere, great pork schnitzel & sausage, kid-friendly', kids: true, book: false, maps: 'https://maps.google.com/?q=Hüsi+Bierhaus+Interlaken+Switzerland' },
      { name: 'Café de Paris', type: '☕ Café/Brasserie', price: 'CHF 18–30', note: 'Good beer, food, nice location — popular with families', kids: true, book: false, maps: 'https://maps.google.com/?q=Café+de+Paris+Interlaken+Switzerland' },
      { name: 'Xport Pizza', type: '🍕 Pizza/Kebab', price: 'CHF 12–22', note: 'Budget-friendly pizza, burgers, kebab — quick and filling', kids: true, book: false, maps: 'https://maps.google.com/?q=Xport+Pizza+Interlaken+Switzerland' },
      { name: 'Coop Restaurant (Interlaken Ost)', type: '🛒 Self-service', price: 'CHF 8–15', note: 'Right at the train station. Fresh buffet, cheapest quality option. Closes 8pm', kids: true, book: false, maps: 'https://maps.google.com/?q=Coop+Restaurant+Interlaken+Ost' },
      { name: 'Migros Restaurant (West station)', type: '🛒 Cafeteria', price: 'CHF 8–14', note: 'Where locals eat — cheap, filling, reliable. Interlaken West station', kids: true, book: false, maps: 'https://maps.google.com/?q=Migros+Restaurant+Interlaken+West' },
      { name: 'Restaurant Alpenrose (hotel)', type: '🍽 Swiss/International', price: 'CHF 22–38', note: 'Your own hotel restaurant — convenient, no travel needed after a long day', kids: true, book: false, maps: '' },
    ]
  },
  2: {
    title: 'Lauterbrunnen / Mürren / Schilthorn area', hotels: 'Alpenrose Hotel, Wilderswil (return for dinner)',
    places: [
      { name: 'Piz Gloria (Schilthorn summit)', type: '🏔 Swiss/International', price: 'CHF 30–55', note: 'Revolving restaurant at 2970m — the Bond villain lair experience! Worth it for the view', kids: true, book: false, maps: 'https://maps.google.com/?q=Piz+Gloria+Schilthorn+Switzerland' },
      { name: 'Restaurant Birg (mid-station)', type: '🏔 Swiss', price: 'CHF 20–35', note: 'More affordable than the summit, still great views, good café too', kids: true, book: false, maps: '' },
      { name: 'Restaurant Jungfrau (Mürren)', type: '🧀 Swiss', price: 'CHF 22–38', note: 'In car-free Mürren village, cozy, great rösti and fondue for lunch', kids: true, book: false, maps: 'https://maps.google.com/?q=Restaurant+Jungfrau+Mürren+Switzerland' },
      { name: 'Staubbach Café (Lauterbrunnen)', type: '☕ Café/Snacks', price: 'CHF 8–20', note: 'Quick stop for coffee, sandwiches, cake near the waterfall', kids: true, book: false, maps: 'https://maps.google.com/?q=Staubbach+Café+Lauterbrunnen' },
      { name: 'Gasthof Bären (Wilderswil — dinner)', type: '🧀 Swiss Fondue', price: 'CHF 20–35', note: 'Return to Wilderswil for a classic fondue dinner. Book ahead for groups!', kids: true, book: true, maps: 'https://maps.google.com/?q=Gasthof+Bären+Wilderswil+Switzerland' },
    ]
  },
  3: {
    title: 'Grindelwald', hotels: 'AlpinHotel Bort (above the village)',
    places: [
      { name: "Barry's Restaurant", type: '🍔 Swiss/International', price: 'CHF 20–38', note: 'Cozy cabin vibes, varied menu — burgers, steaks, salads, good for groups. Book ahead!', kids: true, book: true, maps: "https://maps.google.com/?q=Barry's+Restaurant+Grindelwald+Switzerland" },
      { name: 'Restaurant Pinte', type: '🧀 Swiss', price: 'CHF 20–35', note: 'Main street Grindelwald. One of the best Rösti in Switzerland — a must try!', kids: true, book: false, maps: 'https://maps.google.com/?q=Restaurant+Pinte+Grindelwald+Switzerland' },
      { name: 'Kreuz & Post Restaurant', type: '🧀 Swiss', price: 'CHF 22–45', note: 'Mid-day special CHF 25 is excellent value. Popular with locals, near train station', kids: true, book: false, maps: 'https://maps.google.com/?q=Kreuz+Post+Grindelwald+Switzerland' },
      { name: 'Ristorante Da Salvi', type: '🍕 Italian', price: 'CHF 18–32', note: 'Authentic pizza & pasta at fair prices — great after a long hiking day', kids: true, book: false, maps: 'https://maps.google.com/?q=Ristorante+Da+Salvi+Grindelwald+Switzerland' },
      { name: 'Golden India Grindelwald', type: '🍛 Indian', price: 'CHF 22–38', note: 'Surprisingly good Indian — great for a curry night if the kids want something familiar', kids: true, book: true, maps: 'https://maps.google.com/?q=Golden+India+Restaurant+Grindelwald+Switzerland' },
      { name: "Onkel Tom's Hütte", type: '🍕 Pizza', price: 'CHF 15–28', note: 'Popular budget pizza spot, thin and crispy, casual atmosphere', kids: true, book: false, maps: "https://maps.google.com/?q=Onkel+Tom's+Hütte+Grindelwald+Switzerland" },
      { name: 'Berggasthaus First (summit)', type: '🏔 Alpine', price: 'CHF 20–35', note: 'At the top of the First gondola — eat with Eiger & Wetterhorn views!', kids: true, book: false, maps: '' },
      { name: 'Bäckerei Ringgenberg Café', type: '🥐 Bakery/Café', price: 'CHF 6–18', note: 'Best pastries & coffee in Grindelwald. Perfect for breakfast before heading up First', kids: true, book: false, maps: 'https://maps.google.com/?q=Bäckerei+Ringgenberg+Grindelwald+Switzerland' },
      { name: 'Coop Supermarket (Eiger+ centre)', type: '🛒 Self-service', price: 'CHF 5–14', note: 'Main shopping centre, good sandwiches & ready meals — best budget option', kids: true, book: false, maps: 'https://maps.google.com/?q=Coop+Grindelwald+Switzerland' },
    ]
  },
  4: {
    title: 'Zermatt & Täsch', hotels: 'Hotel Mountime, Täsch (12 min train to Zermatt)',
    places: [
      { name: "Grampi's Bar & Restaurant", type: '🍕 Italian', price: 'CHF 22–38', note: 'Wood-fired pizza & pasta in Zermatt village. Open till 1am! Walk-ins welcome, vegetarian-friendly', kids: true, book: false, maps: "https://maps.google.com/?q=Grampi's+Bar+Restaurant+Zermatt+Switzerland" },
      { name: 'Brown Cow Pub', type: '🍔 Pub/Burgers', price: 'CHF 20–35', note: 'Best burgers in Zermatt — casual, great for kids, no fuss, good value for Zermatt', kids: true, book: false, maps: 'https://maps.google.com/?q=Brown+Cow+Pub+Zermatt+Switzerland' },
      { name: 'Whymper Stube', type: '🧀 Swiss Fondue', price: 'CHF 25–42', note: 'Classic Swiss dining named after the first Matterhorn climber. Excellent cheese fondue', kids: true, book: true, maps: 'https://maps.google.com/?q=Whymper+Stube+Zermatt+Switzerland' },
      { name: 'Le Gitan Grill', type: '🥩 Swiss/Grill', price: 'CHF 28–45', note: 'Small hidden gem, outstanding food, attentive service — the best meal in Zermatt', kids: true, book: true, maps: 'https://maps.google.com/?q=Le+Gitan+Grill+Zermatt+Switzerland' },
      { name: 'Soup du Jour (takeaway window)', type: '🍲 Soup/Snacks', price: 'CHF 8–14', note: 'Famous little to-go soup window in Zermatt village. Baked potato soup is incredible. Eat at the bench with Matterhorn view!', kids: true, book: false, maps: 'https://maps.google.com/?q=Soup+du+Jour+Zermatt+Switzerland' },
      { name: "McDonald's Zermatt", type: '🍟 Fast food', price: 'CHF 10–18', note: "Yes, Zermatt has one! Kids know it. Quick and easy if everyone's tired after Klein Matterhorn", kids: true, book: false, maps: "https://maps.google.com/?q=McDonald's+Zermatt+Switzerland" },
      { name: 'Chez Vrony (Findeln hamlet)', type: '🏔 Swiss Alpine', price: 'CHF 30–55', note: 'Above Zermatt with Matterhorn views — spectacular for a special lunch. 20 min walk from Sunnegga', kids: false, book: true, maps: 'https://maps.google.com/?q=Chez+Vrony+Findeln+Zermatt+Switzerland' },
      { name: 'Vivanda', type: '🍝 Italian', price: 'CHF 25–42', note: 'Homemade carbonara ravioli that reviewers call "out of this world". Moderate Zermatt pricing', kids: true, book: true, maps: 'https://maps.google.com/?q=Vivanda+Restaurant+Zermatt+Switzerland' },
      { name: 'Hotel Mountime Restaurant (Täsch)', type: '🍽 Swiss', price: 'CHF 18–32', note: 'Your own hotel restaurant in Täsch — no train needed after a long day!', kids: true, book: false, maps: 'https://maps.google.com/?q=Hotel+Mountime+Täsch+Switzerland' },
    ]
  },
  5: {
    title: 'Lucerne', hotels: 'Holiday Inn Express, Kriens',
    places: [
      { name: 'Rathaus Brauerei', type: '🍺 Swiss Brewery', price: 'CHF 20–38', note: 'Right next to Chapel Bridge. House-brewed beer, great Alplermagronen (Swiss mac & cheese), huge outdoor terrace', kids: true, book: false, maps: 'https://maps.google.com/?q=Rathaus+Brauerei+Lucerne+Switzerland' },
      { name: 'Restaurant Pfistern', type: '🧀 Swiss Fondue', price: 'CHF 25–45', note: 'Classic Swiss fondue & raclette near Chapel Bridge. Very popular — book ahead for dinner', kids: true, book: true, maps: 'https://maps.google.com/?q=Restaurant+Pfistern+Lucerne+Switzerland' },
      { name: 'Tibits (Lucerne station)', type: '🥗 Vegetarian buffet', price: 'CHF 10–20', note: 'Pay by weight vegetarian buffet on the upper floor of Lucerne station. Huge selection, great for picky eaters', kids: true, book: false, maps: 'https://maps.google.com/?q=Tibits+Lucerne+Switzerland' },
      { name: 'Mamma Leone', type: '🍕 Italian', price: 'CHF 20–40', note: 'Great pizza and pasta, lively atmosphere, very family-friendly. CHF 20–40 mains', kids: true, book: false, maps: 'https://maps.google.com/?q=Mamma+Leone+Lucerne+Switzerland' },
      { name: 'Grottino 1313', type: '🍝 Italian/Family-style', price: 'CHF 22–38', note: 'No menu — antipasti & pasta served family-style at the table. Cozy fireplace, rustic feel', kids: true, book: true, maps: 'https://maps.google.com/?q=Grottino+1313+Lucerne+Switzerland' },
      { name: 'Jialu Chinese Restaurant', type: '🥟 Chinese', price: 'CHF 18–32', note: 'Excellent lakeside Chinese food, friendly staff, very reasonable prices for Switzerland', kids: true, book: false, maps: 'https://maps.google.com/?q=Jialu+Chinese+Restaurant+Lucerne+Switzerland' },
      { name: 'Parterre', type: '🍽 Swiss/European', price: 'CHF 18–30', note: 'Local favourite — excellent value, big portions, around CHF 23 for a main', kids: true, book: false, maps: 'https://maps.google.com/?q=Parterre+Lucerne+Switzerland' },
      { name: 'Coop Restaurant (Bahnhof)', type: '🛒 Self-service', price: 'CHF 8–15', note: 'Closes 4pm — great quick cheap lunch before afternoon activities', kids: true, book: false, maps: 'https://maps.google.com/?q=Coop+Restaurant+Luzern+Bahnhof' },
    ]
  },
  6: {
    title: 'Zurich', hotels: 'Holiday Inn Express, Rümlang',
    places: [
      { name: 'Zeughauskeller', type: '🍺 Swiss Beer Hall', price: 'CHF 20–38', note: 'Historic 1487 weapons depot turned beer hall. Great sausages, schnitzel, huge portions', kids: true, book: false, maps: 'https://maps.google.com/?q=Zeughauskeller+Zurich+Switzerland' },
      { name: 'Tibits Zurich', type: '🥗 Vegetarian buffet', price: 'CHF 10–22', note: 'Pay by weight vegetarian buffet — healthy, reasonably priced, multiple Zurich locations', kids: true, book: false, maps: 'https://maps.google.com/?q=Tibits+Zurich+Switzerland' },
      { name: 'Hiltl', type: '🌱 Vegetarian', price: 'CHF 18–35', note: "World's oldest vegetarian restaurant (1898!). Huge buffet, excellent quality, very family-friendly", kids: true, book: false, maps: 'https://maps.google.com/?q=Hiltl+Vegetarian+Restaurant+Zurich+Switzerland' },
      { name: 'Swiss Chuchi (Old Town)', type: '🧀 Swiss Fondue', price: 'CHF 25–42', note: 'Classic Swiss fondue and raclette in Zurich old town. Book for dinner — very popular', kids: true, book: true, maps: 'https://maps.google.com/?q=Swiss+Chuchi+Zurich+Switzerland' },
      { name: 'India House Zurich', type: '🍛 Indian', price: 'CHF 20–35', note: 'Solid Indian near old town — good butter chicken, naan, biryani. Good for the families', kids: true, book: false, maps: 'https://maps.google.com/?q=India+House+Zurich+Switzerland' },
      { name: 'Crazy Cow Burger', type: '🍔 Burgers', price: 'CHF 18–28', note: 'Popular Zurich burger chain — big portions, great for kids who want something familiar', kids: true, book: false, maps: 'https://maps.google.com/?q=Crazy+Cow+Burger+Zurich+Switzerland' },
      { name: 'Niederdorf street stalls', type: '🥙 Street food', price: 'CHF 8–18', note: 'Niederdorfstrasse: bakeries, döner, pizza slices — great for a quick cheap lunch on the go', kids: true, book: false, maps: 'https://maps.google.com/?q=Niederdorfstrasse+Zurich+Switzerland' },
      { name: 'Café Odeon', type: '☕ Historic Café', price: 'CHF 15–28', note: 'Art Nouveau café where Lenin & Einstein used to sit. Great for lunch or coffee break', kids: true, book: false, maps: 'https://maps.google.com/?q=Café+Odeon+Zurich+Switzerland' },
      { name: 'Coop/Migros (Zurich HB)', type: '🛒 Self-service', price: 'CHF 6–14', note: 'Ground floor of Zurich main station — fastest cheapest quality food in the city', kids: true, book: false, maps: 'https://maps.google.com/?q=Coop+Restaurant+Zurich+HB' },
      { name: 'Ginger Indian Kitchen', type: '🍛 Indian', price: 'CHF 18–32', note: 'Modern Indian near old town — good thali sets and curry options', kids: true, book: false, maps: 'https://maps.google.com/?q=Ginger+Indian+Kitchen+Zurich+Switzerland' },
    ]
  }
};

// Day index from query text ("apr 8", "day 4", "zermatt" etc)
function extractDayFromQuery(q) {
  const lower = q.toLowerCase();
  if (lower.includes('apr 4') || lower.includes('april 4')) return 0;
  if (lower.includes('apr 5') || lower.includes('april 5') || lower.includes('wilderswil') || lower.includes('interlaken') || lower.includes('arrival')) return 1;
  if (lower.includes('apr 6') || lower.includes('april 6') || lower.includes('schilthorn') || lower.includes('lauterbrunnen') || lower.includes('mürren') || lower.includes('murren')) return 2;
  if (lower.includes('apr 7') || lower.includes('april 7') || lower.includes('grindelwald')) return 3;
  if (lower.includes('apr 8') || lower.includes('april 8') || lower.includes('zermatt') || lower.includes('täsch') || lower.includes('tasch') || lower.includes('matterhorn')) return 4;
  if (lower.includes('apr 9') || lower.includes('april 9') || lower.includes('lucerne') || lower.includes('luzern')) return 5;
  if (lower.includes('apr 10') || lower.includes('april 10') || lower.includes('zurich') || lower.includes('zürich')) return 6;
  return null;
}

// Is this a food/restaurant query?
function isFoodQuery(q) {
  const words = ['restaurant', 'food', 'eat', 'dinner', 'lunch', 'breakfast', 'hungry', 'meal', 'fondue', 'raclette', 'rosti', 'rösti', 'pizza', 'indian', 'thai', 'chinese', 'italian', 'burger', 'cafe', 'café', 'coffee', 'hotel', 'near', 'place', 'where', 'tonight'];
  return words.some(w => q.toLowerCase().includes(w));
}

// Filter places by cuisine preference
function filterPlaces(places, q) {
  const lower = q.toLowerCase();
  let filtered = places;

  if (lower.includes('indian') || lower.includes('curry') || lower.includes('biryani') || lower.includes('butter chicken')) {
    filtered = places.filter(p => p.type.includes('Indian') || p.note.toLowerCase().includes('indian'));
  } else if (lower.includes('thai')) {
    filtered = places.filter(p => p.type.includes('Thai') || p.note.toLowerCase().includes('thai'));
  } else if (lower.includes('chinese')) {
    filtered = places.filter(p => p.type.includes('Chinese') || p.note.toLowerCase().includes('chinese'));
  } else if (lower.includes('italian') || lower.includes('pasta') || lower.includes('pizza')) {
    filtered = places.filter(p => p.type.includes('Italian') || p.type.includes('Pizza') || p.note.toLowerCase().includes('pizza') || p.note.toLowerCase().includes('pasta'));
  } else if (lower.includes('fondue') || lower.includes('raclette') || lower.includes('swiss')) {
    filtered = places.filter(p => p.type.includes('Swiss') || p.note.toLowerCase().includes('fondue') || p.note.toLowerCase().includes('raclette'));
  } else if (lower.includes('vegetarian') || lower.includes('veg') || lower.includes('vegan')) {
    filtered = places.filter(p => p.type.includes('Vegetarian') || p.type.includes('🌱') || p.note.toLowerCase().includes('vegetarian'));
  } else if (lower.includes('cheap') || lower.includes('budget') || lower.includes('inexpensive') || lower.includes('affordable')) {
    filtered = places.filter(p => p.type.includes('🛒') || parseInt(p.price.replace(/[^0-9].*/,'')) <= 20);
  } else if (lower.includes('kids') || lower.includes('children') || lower.includes('family')) {
    filtered = places.filter(p => p.kids);
  } else if (lower.includes('burger')) {
    filtered = places.filter(p => p.type.includes('Burger') || p.note.toLowerCase().includes('burger'));
  } else if (lower.includes('breakfast') || lower.includes('coffee') || lower.includes('café') || lower.includes('cafe')) {
    filtered = places.filter(p => p.type.includes('☕') || p.type.includes('🥐') || p.type.includes('Café') || p.type.includes('Bakery'));
  }

  // If filter gives nothing, return all
  return filtered.length > 0 ? filtered : places;
}

// Deep links for any query
function buildDeepLinks(q, dayIndex) {
  const data = RESTAURANTS[dayIndex];
  const city = data ? data.title.split('&')[0].trim().split('/')[0].trim() : 'Switzerland';
  const cityEnc = encodeURIComponent(city + ' Switzerland');
  const qEnc = encodeURIComponent(q + ' ' + city);
  const links = [];

  const lower = q.toLowerCase();
  const isFood = isFoodQuery(lower);
  const isTrain = lower.includes('train') || lower.includes('sbb') || lower.includes('rail') || lower.includes('timetable');
  const isWeather = lower.includes('weather') || lower.includes('forecast') || lower.includes('rain');

  if (isFood) {
    links.push({ label: '🗺 Google Maps', url: `https://www.google.com/maps/search/restaurants+near+${cityEnc}` });
    links.push({ label: '⭐ TripAdvisor', url: `https://www.tripadvisor.com/Search?q=${qEnc}` });
    links.push({ label: '🍽 TheFork', url: `https://www.thefork.ch/search?query=${encodeURIComponent(city)}` });
  } else if (isTrain) {
    links.push({ label: '🚂 SBB Journey Planner', url: 'https://www.sbb.ch/en/buying/pages/fahrplan/fahrplan.xhtml' });
  } else if (isWeather) {
    links.push({ label: '📡 MeteoSwiss', url: 'https://www.meteoswiss.admin.ch' });
  } else {
    links.push({ label: '🔍 Google Search', url: `https://www.google.com/search?q=${qEnc}` });
  }

  return links;
}

router.post('/', async (req, res) => {
  const { query, dayIndex: rawDay } = req.body;
  if (!query) return res.status(400).json({ error: 'query required' });

  const q = query.toLowerCase();

  // Determine day: check query text first, then fall back to sent dayIndex
  const dayFromQuery = extractDayFromQuery(query);
  const dayIndex = dayFromQuery !== null ? dayFromQuery : (parseInt(rawDay) || 0);

  const data = RESTAURANTS[dayIndex];
  const deepLinks = buildDeepLinks(query, dayIndex);

  // Food query → return curated picks
  if (data && isFoodQuery(q)) {
    const filtered = filterPlaces(data.places, query);
    const showing = filtered.slice(0, 10);

    let reply = `🍽 **${showing.length} places near ${data.title}**\n`;
    reply += `🏨 Your hotel: ${data.hotels}\n\n`;

    showing.forEach((p, i) => {
      reply += `**${i + 1}. ${p.name}** ${p.kids ? '👨‍👩‍👧' : ''}\n`;
      reply += `${p.type} · ${p.price}\n`;
      reply += `${p.note}\n`;
      if (p.book) reply += `📞 Book ahead recommended\n`;
      if (p.maps) reply += `[📍 Maps](${p.maps})\n`;
      reply += '\n';
    });

    reply += `---\n⏰ **Hours**: Lunch 12:00–14:00 · Dinner 18:30–21:30\n💡 Kitchens close sharp in Switzerland — don't arrive late!`;

    return res.json({ reply, links: deepLinks });
  }

  // Train query
  if (q.includes('train') || q.includes('sbb') || q.includes('connection') || q.includes('timetable')) {
    return res.json({
      reply: `🚂 **Swiss Train Tips**\n\nYour Swiss Travel Pass covers almost every train, boat and bus.\nUse the **SBB app** for live times, platform info and delays.\n\nKey connections:\n• Wilderswil → Grindelwald: ~50 min via Interlaken Ost\n• Grindelwald → Zermatt: ~4h 30 min via Interlaken/Brig\n• Zermatt → Lucerne: ~4h via Visp/Bern\n• Lucerne → Zurich: ~1h IC train\n\n⚠️ Swiss trains run to the minute — be on the platform 2 min early!`,
      links: deepLinks
    });
  }

  // Weather query
  if (q.includes('weather') || q.includes('rain') || q.includes('forecast') || q.includes('snow')) {
    return res.json({
      reply: `🌤 **Weather for ${data?.title || 'Switzerland'}**\n\nBest sources:\n• **MeteoSwiss app** — official Swiss forecast, very accurate for mountains\n• Forecasts update 4× daily\n\nApril expectations:\n• Valley (Interlaken/Lucerne/Zurich): 8–16°C\n• Mid-mountain (Grindelwald): 2–10°C\n• High summits (Schilthorn/Matterhorn): −5 to 2°C\n\n💡 Always check webcams morning of a summit day!`,
      links: deepLinks
    });
  }

  // Opening hours query — only if NOT a food query
  if (!isFoodQuery(q) && (q.includes('open') || q.includes('hours') || q.includes('close') || q.includes('timing') || q.includes('when'))) {
    return res.json({
      reply: `⏰ **Swiss Restaurant & Shop Hours**\n\nRestaurants:\n• Breakfast: 7:00–10:30\n• Lunch: 12:00–14:00 (kitchens close sharp!)\n• Dinner: 18:30–21:30 (last orders ~21:00)\n• Many close Monday or Tuesday\n\nSupermarkets (Coop/Migros):\n• Mon–Sat: 7:00–21:00\n• Sunday: Often closed or limited hours\n• Train station branches: open 7 days, sometimes till 22:00\n\n💡 Switzerland is strict about hours — don't arrive 10 min before closing and expect a table.`,
      links: deepLinks
    });
  }

  // Food query but no restaurant data for this exact day — find nearest day with data
  if (isFoodQuery(q)) {
    // Find closest day with restaurant data, preferring current or future days
    const daysWithData = [1, 2, 3, 4, 5, 6];
    const bestDay = daysWithData.reduce((best, d) => {
      return Math.abs(d - dayIndex) < Math.abs(best - dayIndex) ? d : best;
    }, daysWithData[0]);
    const bestData = RESTAURANTS[bestDay];

    if (bestData) {
      const filtered = filterPlaces(bestData.places, query);
      const showing = filtered.slice(0, 10);
      let reply = `🍽 **${showing.length} places near ${bestData.title}**\n`;
      reply += `🏨 Your hotel: ${bestData.hotels}\n\n`;
      showing.forEach((p, i) => {
        reply += `**${i + 1}. ${p.name}** ${p.kids ? '👨\u200d👩\u200d👧' : ''}\n`;
        reply += `${p.type} · ${p.price}\n`;
        reply += `${p.note}\n`;
        if (p.book) reply += `📞 Book ahead recommended\n`;
        if (p.maps) reply += `[📍 Maps](${p.maps})\n`;
        reply += '\n';
      });
      reply += `---\n⏰ **Hours**: Lunch 12:00–14:00 · Dinner 18:30–21:30\n💡 Kitchens close sharp — don't arrive late!`;
      return res.json({ reply, links: deepLinks });
    }
  }

  // Generic fallback with suggestions
  const allLocations = Object.values(RESTAURANTS).map(d => d.title.split('&')[0].trim()).join(', ');
  res.json({
    reply: `🔍 **Search tips** — try:\n• "restaurants apr 8" or "restaurants zermatt"\n• "indian food grindelwald"\n• "fondue tonight"\n• "cheap dinner lucerne"\n• "train times"\n• "what time do restaurants open"\n\nLocations with curated picks: ${allLocations}`,
    links: deepLinks
  });
});

module.exports = router;
