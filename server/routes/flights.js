const router = require('express').Router();

const FLIGHTS = {
  'UA8392': { label: 'Ashok family outbound', date: '2026-04-04', from: 'ATL', to: 'GVA', via: 'YUL', dep: '13:05', arr: '09:55+1', airline: 'United' },
  'UA749':  { label: 'Ashok return (1/2)', date: '2026-04-11', from: 'GVA', to: 'IAD', dep: '11:00', arr: '14:30', airline: 'United' },
  'UA1635': { label: 'Ashok return (2/2)', date: '2026-04-11', from: 'IAD', to: 'ATL', dep: '22:08', arr: '00:30', airline: 'United' },
  'DL9375': { label: 'Rajesh family outbound (1/3)', date: '2026-04-04', from: 'ATL', to: 'AMS', dep: '22:00', arr: '13:30+1', airline: 'Delta' },
  'DL9435': { label: 'Rajesh family outbound (2/3)', date: '2026-04-05', from: 'AMS', to: 'ZUR', dep: '15:00', arr: '16:30',   airline: 'Delta' },
  'DL9244': { label: 'Rajesh family return (1/3)', date: '2026-04-11', from: 'ZUR', to: 'AMS', dep: '14:00', arr: '15:45',   airline: 'Delta' },
  'DL9358': { label: 'Rajesh family return (2/3)', date: '2026-04-11', from: 'AMS', to: 'JFK', dep: '17:30', arr: '20:00',   airline: 'Delta' },
  'DL2245': { label: 'Rajesh family return (3/3)', date: '2026-04-11', from: 'JFK', to: 'ATL', dep: '21:30', arr: '23:59',   airline: 'Delta' },
};

// Security advisory logic — no external API needed
const AIRPORT_ADVISORIES = {
  'ATL': {
    name: 'Hartsfield-Jackson Atlanta',
    international: true,
    tips: [
      'Arrive 3 hours before international departure',
      'Terminal F for international — separate security from domestic',
      'TSA PreCheck lanes typically 5–15 min',
      'Standard lanes can be 30–60 min in peak hours (6–9 AM, 3–6 PM)',
    ],
    peakHours: '6–9 AM and 3–6 PM are busiest',
    myTsaLink: 'https://www.tsa.gov/mobile',
    flightAwareLink: 'https://www.flightaware.com/live/airport/KATL',
  },
  'GVA': {
    name: 'Geneva Airport',
    international: false,
    tips: [
      'Arrive 2.5 hours before departure',
      'Schengen vs non-Schengen security are separate — follow signs carefully',
      'US-bound flights: US customs pre-clearance available at GVA',
      'Security typically 10–20 min — efficient airport',
    ],
    peakHours: '6–8 AM and 4–7 PM busiest',
    flightAwareLink: 'https://www.flightaware.com/live/airport/LSGG',
    officialLink: 'https://www.gva.ch/en/Travelers/Passenger-information/security',
  },
  'ZUR': {
    name: 'Zurich Airport',
    international: false,
    tips: [
      'Arrive 2.5 hours before departure',
      'One of Europe\'s most efficient airports — security usually 10–15 min',
      'Check-in closes 45 min before departure — do not be late',
      'Hotel is 5 min by shuttle/taxi from terminal',
    ],
    peakHours: '6–9 AM peak — earlier is smoother',
    flightAwareLink: 'https://www.flightaware.com/live/airport/LSZH',
    officialLink: 'https://www.zurich-airport.com/passengers-and-visitors/departure/security-check',
  },
};

// GET /api/flights/:flightNumber — live status via AviationStack if key set
router.get('/:flightNumber', async (req, res) => {
  const fn = req.params.flightNumber.toUpperCase();
  const staticData = FLIGHTS[fn];

  if (!staticData) {
    return res.status(404).json({ error: 'Flight not in trip manifest' });
  }

  const apiKey = process.env.AVIATIONSTACK_API_KEY;

  // No API key — return static schedule data only
  if (!apiKey) {
    return res.json({
      flight: fn,
      ...staticData,
      status: 'scheduled',
      live: false,
      message: 'Live tracking not configured — showing scheduled times',
    });
  }

  // Try AviationStack free tier
  try {
    const iataCode = fn.replace(/[0-9]/g, '').substring(0, 2) + fn.replace(/[^0-9]/g, '');
    const url = `http://api.aviationstack.com/v1/flights?access_key=${apiKey}&flight_iata=${fn}&limit=1`;
    const response = await fetch(url, { signal: AbortSignal.timeout(8000) });
    const data = await response.json();

    if (!response.ok || data.error) {
      throw new Error(data.error?.info || 'AviationStack error');
    }

    const flight = data.data?.[0];
    if (!flight) {
      return res.json({ flight: fn, ...staticData, live: false, message: 'No live data yet — showing schedule' });
    }

    res.json({
      flight: fn,
      label: staticData.label,
      live: true,
      status: flight.flight_status,
      departure: {
        airport: flight.departure?.airport,
        iata: flight.departure?.iata,
        scheduled: flight.departure?.scheduled,
        estimated: flight.departure?.estimated,
        actual: flight.departure?.actual,
        delay: flight.departure?.delay,
        terminal: flight.departure?.terminal,
        gate: flight.departure?.gate,
      },
      arrival: {
        airport: flight.arrival?.airport,
        iata: flight.arrival?.iata,
        scheduled: flight.arrival?.scheduled,
        estimated: flight.arrival?.estimated,
        actual: flight.arrival?.actual,
        delay: flight.arrival?.delay,
        terminal: flight.arrival?.terminal,
        gate: flight.arrival?.gate,
      },
      airline: flight.airline?.name,
      aircraft: flight.aircraft?.registration,
    });

  } catch (e) {
    console.error('AviationStack error:', e.message);
    res.json({ flight: fn, ...staticData, live: false, message: 'Live data unavailable — showing schedule' });
  }
});

// GET /api/flights/airport/:code — security advisory
router.get('/airport/:code', async (req, res) => {
  const code = req.params.code.toUpperCase();
  const advisory = AIRPORT_ADVISORIES[code];
  if (!advisory) return res.status(404).json({ error: 'Airport not found' });
  res.json({ airport: code, ...advisory });
});

module.exports = router;
