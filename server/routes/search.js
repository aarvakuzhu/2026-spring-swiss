const router = require('express').Router();

// ── CURATED RESTAURANT DATABASE ──
// Real restaurants, verified mid-range/budget, family-friendly
// Prices in CHF per main course
const RESTAURANTS = {
  1: { // Apr 5 — Wilderswil / Interlaken
    title: 'Wilderswil & Interlaken',
    hotels: 'Alpenrose Hotel, Wilderswil',
    places: [
      { name: 'Gasthof Bären', type: '🧀 Swiss', price: 'CHF 20–35', note: 'Classic Swiss, excellent cheese fondue, 2 min from Alpenrose', kids: true, book: false, maps: 'https://maps.google.com/?q=Gasthof+Bären+Wilderswil' },
      { name: 'Restaurant Alpenrose (hotel)', type: '🍽 Swiss/International', price: 'CHF 22–38', note: 'Your own hotel restaurant — convenient, decent Swiss fare', kids: true, book: false, maps: '' },
      { name: 'Little Thai', type: '🍜 Thai', price: 'CHF 18–27', note: 'Highly rated Thai in Interlaken, great for families (Hauptstrasse 19, Matten)', kids: true, book: false, maps: 'https://maps.google.com/?q=Little+Thai+Interlaken' },
      { name: 'Layaly Beirut', type: '🥗 Lebanese', price: 'CHF 15–30', note: 'Mezze, hummus, kebab — fresh and healthy, great value', kids: true, book: true, maps: 'https://maps.google.com/?q=Layaly+Beirut+Interlaken' },
      { name: 'India Village', type: '🍛 Indian', price: 'CHF 22–35', note: 'Best Indian in Interlaken, butter chicken highly rated', kids: true, book: false, maps: 'https://maps.google.com/?q=India+Village+Restaurant+Interlaken' },
      { name: 'Hüsi Bierhaus', type: '🍺 Swiss/Pub', price: 'CHF 20–35', note: 'Lively, great schnitzel & sausage, kid-friendly atmosphere', kids: true, book: false, maps: 'https://maps.google.com/?q=Hüsi+Bierhaus+Interlaken' },
      { name: 'Café de Paris', type: '☕ Café/Brasserie', price: 'CHF 18–30', note: 'Good beer, good food, nice location — popular with families', kids: true, book: false, maps: 'https://maps.google.com/?q=Café+de+Paris+Interlaken' },
      { name: 'Xport Pizza', type: '🍕 Pizza/Kebab', price: 'CHF 12–22', note: 'Budget-friendly pizza, burgers, kebab near Balmers — quick & filling', kids: true, book: false, maps: 'https://maps.google.com/?q=Xport+Pizza+Interlaken' },
      { name: 'Coop Restaurant (Interlaken Ost)', type: '🛒 Self-service', price: 'CHF 8–15', note: 'Right at the train station, fresh buffet, cheapest quality option', kids: true, book: false, maps: 'https://maps.google.com/?q=Coop+Restaurant+Interlaken+Ost' },
      { name: 'Migros Restaurant (West)', type: '🛒 Cafeteria', price: 'CHF 8–14', note: 'Where locals eat — cheap, filling, reliable. Interlaken West station', kids: true, book: false, maps: 'https://maps.google.com/?q=Migros+Restaurant+Interlaken+West' },
    ]
  },
  2: { // Apr 6 — Lauterbrunnen / Mürren (day trip from Wilderswil)
    title: 'Lauterbrunnen / Mürren Area',
    hotels: 'Alpenrose Hotel, Wilderswil (return for dinner)',
    places: [
      { name: 'Restaurant Jungfrau (Mürren)', type: '🧀 Swiss', price: 'CHF 22–38', note: 'In car-free Mürren village, cozy, great rösti and fondue', kids: true, book: false, maps: 'https://maps.google.com/?q=Restaurant+Jungfrau+Mürren' },
      { name: 'Piz Gloria Revolving Restaurant (Schilthorn)', type: '🏔 Swiss/International', price: 'CHF 30–50', note: 'Summit restaurant at 2970m — expensive but the view is the experience!', kids: true, book: false, maps: 'https://maps.google.com/?q=Piz+Gloria+Schilthorn' },
      { name: 'Staubbach Café (Lauterbrunnen)', type: '☕ Café', price: 'CHF 10–20', note: 'Quick stop for coffee, sandwiches, cake near the waterfall', kids: true, book: false, maps: 'https://maps.google.com/?q=Café+Lauterbrunnen' },
      { name: 'Restaurant Schilthorn (Birg)', type: '🏔 Swiss', price: 'CHF 20–35', note: 'Mid-station at Birg — more affordable than summit, good views', kids: true, book: false, maps: '' },
      { name: 'Gasthof Bären (Wilderswil dinner)', type: '🧀 Swiss', price: 'CHF 20–35', note: 'Return to Wilderswil for dinner — book fondue ahead', kids: true, book: true, maps: 'https://maps.google.com/?q=Gasthof+Bären+Wilderswil' },
    ]
  },
  3: { // Apr 7 — Grindelwald
    title: 'Grindelwald',
    hotels: 'AlpinHotel Bort (above town)',
    places: [
      { name: "Barry's Restaurant", type: '🍔 Swiss/International', price: 'CHF 20–38', note: 'Cozy cabin vibes, varied menu — burgers, steaks, salads. Book ahead!', kids: true, book: true, maps: "https://maps.google.com/?q=Barry's+Restaurant+Grindelwald" },
      { name: 'Kreuz & Post Restaurant', type: '🧀 Swiss', price: 'CHF 25–45', note: 'Mid-day special CHF 25 — popular with locals, near train station', kids: true, book: false, maps: 'https://maps.google.com/?q=Kreuz+Post+Grindelwald' },
      { name: 'Restaurant Pinte', type: '🍺 Swiss/Pub', price: 'CHF 20–35', note: 'Main street, great Rösti — one of the best in Switzerland!', kids: true, book: false, maps: 'https://maps.google.com/?q=Restaurant+Pinte+Grindelwald' },
      { name: 'Ristorante Da Salvi', type: '🍕 Italian', price: 'CHF 18–32', note: 'Authentic pizza & pasta, mid-range prices for the area', kids: true, book: false, maps: 'https://maps.google.com/?q=Ristorante+Da+Salvi+Grindelwald' },
      { name: 'Golden India Grindelwald', type: '🍛 Indian', price: 'CHF 22–38', note: 'Surprisingly good Indian in Grindelwald — great for a curry night', kids: true, book: true, maps: 'https://maps.google.com/?q=Golden+India+Restaurant+Grindelwald' },
      { name: 'Onkel Tom\'s Hütte', type: '🍕 Pizza/Pasta', price: 'CHF 15–28', note: 'Popular cheap eats spot, thin-crust pizza, casual', kids: true, book: false, maps: "https://maps.google.com/?q=Onkel+Tom's+Hütte+Grindelwald" },
      { name: 'Berggasthaus First (summit)', type: '🏔 Alpine', price: 'CHF 20–35', note: 'At the top of Grindelwald First — eat with Eiger views!', kids: true, book: false, maps: 'https://maps.google.com/?q=Berggasthaus+First+Grindelwald' },
      { name: 'Café Ringgenberg Bakery', type: '🥐 Bakery/Café', price: 'CHF 6–18', note: 'Best pastries & coffee in Grindelwald, great breakfast spot', kids: true, book: false, maps: 'https://maps.google.com/?q=Bäckerei+Ringgenberg+Grindelwald' },
      { name: 'Coop Supermarket (Eiger+)', type: '🛒 Self-service', price: 'CHF 5–14', note: 'In the main shopping centre, good sandwiches & ready meals', kids: true, book: false, maps: 'https://maps.google.com/?q=Coop+Grindelwald' },
    ]
  },
  4: { // Apr 8 — Zermatt / Tasch
    title: 'Zermatt (& Täsch hotel area)',
    hotels: 'Hotel Mountime, Täsch',
    places: [
      { name: "Grampi's Bar & Restaurant", type: '🍕 Italian', price: 'CHF 22–38', note: 'Wood-fired pizza, pasta, open late (1am!), vegetarian-friendly, in Zermatt village', kids: true, book: false, maps: "https://maps.google.com/?q=Grampi's+Bar+Restaurant+Zermatt" },
      { name: 'Brown Cow Pub', type: '🍔 Pub/Burgers', price: 'CHF 20–35', note: 'Best burgers in Zermatt — casual, great for kids, no fuss', kids: true, book: false, maps: 'https://maps.google.com/?q=Brown+Cow+Pub+Zermatt' },
      { name: 'Whymper Stube', type: '🧀 Swiss/Fondue', price: 'CHF 25–40', note: 'Classic Swiss in a historic setting, excellent cheese fondue', kids: true, book: true, maps: 'https://maps.google.com/?q=Whymper+Stube+Zermatt' },
      { name: 'Le Gitan Grill', type: '🥩 Swiss/Grill', price: 'CHF 28–45', note: 'Small hidden gem, outstanding food, top service — book ahead!', kids: true, book: true, maps: 'https://maps.google.com/?q=Le+Gitan+Zermatt' },
      { name: 'Riffelalp Resort (self-service)', type: '🏔 Alpine', price: 'CHF 18–30', note: 'Family-friendly self-service near Gornergrat, good value mountain food', kids: true, book: false, maps: '' },
      { name: 'McDonald\'s Zermatt', type: '🍟 Fast food', price: 'CHF 10–18', note: 'Yes, Zermatt has one! Kids will know it, quick & easy', kids: true, book: false, maps: "https://maps.google.com/?q=McDonald's+Zermatt" },
      { name: 'Soup du Jour window', type: '🍲 Soup/Takeaway', price: 'CHF 8–14', note: 'Famous little to-go soup window in Zermatt village — baked potato soup is unreal!', kids: true, book: false, maps: 'https://maps.google.com/?q=Soup+du+Jour+Zermatt' },
      { name: 'Restaurant Enzian (Findeln hamlet)', type: '🧀 Swiss Alpine', price: 'CHF 25–42', note: 'Hamlet above Zermatt, cheese fondue & raclette with Matterhorn views', kids: false, book: true, maps: 'https://maps.google.com/?q=Restaurant+Enzian+Findeln+Zermatt' },
      { name: 'Hotel Mountime Restaurant (Täsch)', type: '🍽 Swiss', price: 'CHF 18–32', note: 'Your own hotel in Täsch — convenient after a long day, no travel needed', kids: true, book: false, maps: 'https://maps.google.com/?q=Hotel+Mountime+Täsch' },
    ]
  },
  5: { // Apr 9 — Lucerne
    title: 'Lucerne',
    hotels: 'Holiday Inn Express, Kriens',
    places: [
      { name: 'Rathaus Brauerei', type: '🍺 Swiss/Brewery', price: 'CHF 20–38', note: 'Next to Chapel Bridge, house beer is famous, great Alplermagronen (mac & cheese)', kids: true, book: false, maps: 'https://maps.google.com/?q=Rathaus+Brauerei+Lucerne' },
      { name: 'Restaurant Pfistern', type: '🧀 Swiss', price: 'CHF 25–45', note: 'Near Chapel Bridge, classic fondue & raclette, very popular', kids: true, book: true, maps: 'https://maps.google.com/?q=Restaurant+Pfistern+Lucerne' },
      { name: 'Mamma Leone', type: '🍕 Italian', price: 'CHF 20–40', note: 'Great pizza and pasta, lively atmosphere, family-friendly, CHF 20-40', kids: true, book: false, maps: 'https://maps.google.com/?q=Mamma+Leone+Lucerne' },
      { name: 'Grottino 1313', type: '🍝 Italian/Family-style', price: 'CHF 22–38', note: 'No menu — antipasti & pasta served family-style, cozy fireplace atmosphere', kids: true, book: true, maps: 'https://maps.google.com/?q=Grottino+1313+Lucerne' },
      { name: 'Tibits (Lucerne station)', type: '🥗 Vegetarian buffet', price: 'CHF 10–20', note: 'Pay by weight vegetarian buffet — great value, huge selection, kids love it', kids: true, book: false, maps: 'https://maps.google.com/?q=Tibits+Lucerne' },
      { name: 'Jialu Chinese Restaurant', type: '🥟 Chinese', price: 'CHF 18–32', note: 'Excellent lakeside Chinese, friendly staff, reasonable prices for CH', kids: true, book: false, maps: 'https://maps.google.com/?q=Jialu+Chinese+Restaurant+Lucerne' },
      { name: 'Parterre', type: '🍽 Swiss/European', price: 'CHF 18–30', note: 'Student favourite — excellent value, big portions, CHF 23 for a main', kids: true, book: false, maps: 'https://maps.google.com/?q=Parterre+Lucerne' },
      { name: 'Coop Restaurant (train station)', type: '🛒 Self-service', price: 'CHF 8–15', note: 'Closes at 4pm — great for a quick cheap lunch before afternoon activities', kids: true, book: false, maps: 'https://maps.google.com/?q=Coop+Restaurant+Luzern+Bahnhof' },
    ]
  },
  6: { // Apr 10 — Zurich
    title: 'Zurich',
    hotels: 'Holiday Inn Express, Rümlang',
    places: [
      { name: 'Zeughauskeller', type: '🍺 Swiss/Beer Hall', price: 'CHF 20–38', note: 'Historic 15th century weapons depot now a beer hall — great sausages, schnitzel', kids: true, book: false, maps: 'https://maps.google.com/?q=Zeughauskeller+Zurich' },
      { name: 'Tibits Zurich', type: '🥗 Vegetarian buffet', price: 'CHF 10–22', note: 'Pay by weight vegetarian buffet — healthy, cheap, multiple locations', kids: true, book: false, maps: 'https://maps.google.com/?q=Tibits+Zurich' },
      { name: 'Hiltl', type: '🌱 Vegetarian', price: '  CHF 18–35', note: 'World\'s oldest vegetarian restaurant (1898!) — huge buffet, family-friendly', kids: true, book: false, maps: 'https://maps.google.com/?q=Hiltl+Vegetarian+Restaurant+Zurich' },
      { name: 'Café Odeon', type: '☕ Café/Brasserie', price: 'CHF 15–28', note: 'Historic Art Nouveau café where Lenin & Einstein sat — great for lunch', kids: true, book: false, maps: 'https://maps.google.com/?q=Café+Odeon+Zurich' },
      { name: 'Swiss Chuchi (Old Town)', type: '🧀 Swiss/Fondue', price: 'CHF 25–42', note: 'Classic Swiss fondue and raclette in old town — book ahead for dinner', kids: true, book: true, maps: 'https://maps.google.com/?q=Swiss+Chuchi+Zurich' },
      { name: 'Niederdorf street food', type: '🥙 Various', price: 'CHF 8–18', note: 'Niederdorfstrasse has bakeries, döners, pizza slices — great for a quick lunch', kids: true, book: false, maps: 'https://maps.google.com/?q=Niederdorfstrasse+Zurich' },
      { name: 'Crazy Cow Burger', type: '🍔 Burgers', price: 'CHF 18–28', note: 'Popular local burger chain — big portions, kids love it', kids: true, book: false, maps: 'https://maps.google.com/?q=Crazy+Cow+Zurich' },
      { name: 'Lindenhügel Tearoom', type: '☕ Café', price: 'CHF 8–18', note: 'On the panoramic hill, nice coffee break with city views', kids: true, book: false, maps: 'https://maps.google.com/?q=Lindenhügel+Zurich' },
      { name: 'Coop/Migros (Zurich HB)', type: '🛒 Self-service', price: 'CHF 6–14', note: 'Ground floor of Zurich main station — fastest cheapest quality food', kids: true, book: false, maps: 'https://maps.google.com/?q=Coop+Restaurant+Zurich+HB' },
      { name: 'India House Zurich', type: '🍛 Indian', price: 'CHF 20–35', note: 'Solid Indian near old town — good butter chicken & naan', kids: true, book: false, maps: 'https://maps.google.com/?q=India+House+Zurich' },
    ]
  }
};

// ── SMART DEEP LINKS ──
function buildDeepLinks(query, dayIndex, location) {
  const q = query.toLowerCase();
  const city = location.split(/[,·]/)[0].trim();
  const gMapsCity = encodeURIComponent(city + ' Switzerland');
  const links = [];

  if (q.includes('restaurant') || q.includes('food') || q.includes('eat') || q.includes('dinner') || q.includes('lunch') || q.includes('fondue') || q.includes('indian') || q.includes('thai') || q.includes('pizza') || q.includes('italian') || q.includes('chinese') || q.includes('veg')) {
    links.push({ label: '🗺 Google Maps restaurants', url: `https://www.google.com/maps/search/restaurants+near+${gMapsCity}` });
    links.push({ label: '⭐ TripAdvisor', url: `https://www.tripadvisor.com/Search?q=${encodeURIComponent(query+' '+city)}` });
    links.push({ label: '🍽 TheFork', url: `https://www.thefork.ch/search?cityId=&query=${encodeURIComponent(city)}` });
  }
  if (q.includes('train') || q.includes('sbb') || q.includes('rail') || q.includes('timetable') || q.includes('connection')) {
    links.push({ label: '🚂 SBB Journey Planner', url: 'https://www.sbb.ch/en/buying/pages/fahrplan/fahrplan.xhtml' });
  }
  if (q.includes('weather') || q.includes('forecast') || q.includes('rain') || q.includes('snow')) {
    links.push({ label: '📡 MeteoSwiss', url: 'https://www.meteoswiss.admin.ch' });
  }
  if (!links.length) {
    links.push({ label: '🔍 Google', url: `https://www.google.com/search?q=${encodeURIComponent(query+' '+city+' Switzerland')}` });
  }
  return links;
}

// ── QUERY MATCHING ──
function findRestaurants(query, dayIndex) {
  const data = RESTAURANTS[dayIndex];
  if (!data) return null;

  const q = query.toLowerCase();
  let places = data.places;

  // Filter by query intent
  if (q.includes('indian') || q.includes('curry') || q.includes('asian')) {
    places = places.filter(p => p.type.includes('Indian') || p.type.includes('Chinese') || p.type.includes('Thai') || p.type.includes('Asian'));
    if (!places.length) places = data.places; // fallback to all
  } else if (q.includes('fondue') || q.includes('swiss') || q.includes('cheese') || q.includes('raclette')) {
    places = places.filter(p => p.type.includes('Swiss') || p.note.toLowerCase().includes('fondue'));
    if (!places.length) places = data.places;
  } else if (q.includes('pizza') || q.includes('italian') || q.includes('pasta')) {
    places = places.filter(p => p.type.includes('Italian') || p.type.includes('Pizza'));
    if (!places.length) places = data.places;
  } else if (q.includes('cheap') || q.includes('budget') || q.includes('inexpensive')) {
    places = places.filter(p => p.type.includes('🛒') || parseInt(p.price.replace('CHF ','')) < 20);
    if (!places.length) places = data.places;
  } else if (q.includes('vegetarian') || q.includes('veg') || q.includes('vegan')) {
    places = places.filter(p => p.type.includes('Vegetarian') || p.note.toLowerCase().includes('vegetarian'));
    if (!places.length) places = data.places;
  } else if (q.includes('kids') || q.includes('family') || q.includes('children')) {
    places = places.filter(p => p.kids);
  }

  return { ...data, places: places.slice(0, 10) };
}

// POST /api/search
router.post('/', async (req, res) => {
  const { query, dayIndex } = req.body;
  if (!query) return res.status(400).json({ error: 'query required' });

  const day = parseInt(dayIndex) || 0;
  const locationData = RESTAURANTS[day];
  const location = locationData?.title || 'Switzerland';

  // Try curated restaurant data first
  const matched = findRestaurants(query, day);
  const deepLinks = buildDeepLinks(query, day, location);

  if (matched && matched.places.length > 0) {
    // Format restaurant cards
    let reply = `📍 **${matched.places.length} options near ${matched.title}**\n`;
    reply += `🏨 Staying at: ${matched.hotels}\n\n`;

    matched.places.forEach((p, i) => {
      reply += `**${i + 1}. ${p.name}** ${p.kids ? '👨‍👩‍👧' : ''}\n`;
      reply += `${p.type} · ${p.price}\n`;
      reply += `${p.note}\n`;
      if (p.book) reply += `📞 Reserve ahead recommended\n`;
      if (p.maps) reply += `[📍 Open in Maps](${p.maps})\n`;
      reply += '\n';
    });

    reply += `---\n⏰ **Swiss restaurant hours**: Lunch 12:00–14:00 · Dinner 18:30–21:30 (kitchens close sharp!)\n`;
    reply += `💡 Always call ahead if booking — especially for fondue.\n`;

    return res.json({ reply, links: deepLinks });
  }

  // Fallback — smart generic response
  let reply = `🔍 **"${query}"** near ${location}\n\n`;

  const q = query.toLowerCase();
  if (q.includes('train') || q.includes('sbb')) {
    reply += `🚂 **Train tips:**\nYour Swiss Travel Pass covers almost everything. Use the SBB app for live times.\nLunch 12:00–14:00 · Dinner 18:30–21:30`;
  } else if (q.includes('open') || q.includes('hours') || q.includes('close') || q.includes('timing')) {
    reply += `⏰ **Swiss restaurant timings:**\n• Breakfast: 7:00–10:00\n• Lunch: 12:00–14:00 (kitchens close sharp)\n• Dinner: 18:30–21:30 (last orders ~21:00)\n• Many close on Monday or Tuesday\n• Alpine restaurants may close between services\n\n💡 Always arrive before kitchen closes — Swiss restaurants are very strict about this!`;
  } else {
    reply += `No specific results found for this query. Try the Google Maps link below, or rephrase — e.g. "Indian restaurants Apr 8" or "fondue tonight Grindelwald".`;
  }

  res.json({ reply, links: deepLinks });
});

module.exports = router;
