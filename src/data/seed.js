/* ============================================================
   Seed data — carried from the prototype, lightly expanded.
   Products map 1:1 to the four "dry" activities; compost + seeds
   are the two "wet" (no-drying) activities.
   ============================================================ */

export const PRODUCTS = [
  { k: 'scrub',   word: 'Scrub',   bg: '#E5E3D6', grams: 60,  act: 'scrub',   line: 'Exfoliating body scrub',             use: 'About 60 g of used grounds per jar' },
  { k: 'soap',    word: 'Soap',    bg: '#E8E0D3', grams: 25,  act: 'soap',    line: 'Cold-process bar with ground coffee', use: 'About 25 g of used grounds per bar' },
  { k: 'candle',  word: 'Candle',  bg: '#E7DED0', grams: 30,  act: 'candle',  line: 'Soy candle with a grounds top layer', use: 'About 30 g of used grounds per candle' },
  { k: 'planter', word: 'Planter', bg: '#DEE3D4', grams: 120, act: 'planter', line: 'Moulded pot that feeds the plant',     use: 'About 120 g of used grounds per pot' },
];

export const ACTS = {
  scrub:   { name: 'Coffee scrub jars',    wet: false, grams: 60,  desc: 'Mix, jar and label a scrub',        learn: 'Circular economy: turning a waste stream into a usable product.' },
  soap:    { name: 'Coffee soap bars',     wet: false, grams: 25,  desc: 'Melt-and-pour, no lye',             learn: 'Material reuse and the idea of a product life-cycle.' },
  candle:  { name: 'Coffee candles',       wet: false, grams: 30,  desc: 'Soy wax with a grounds layer',      learn: 'Upcycling: adding value to a by-product.' },
  planter: { name: 'Grounds planter pots', wet: false, grams: 120, desc: 'Mould pots and plant herbs',        learn: 'Closing the loop: grounds feed the soil that grows food.' },
  compost: { name: 'Compost bin',          wet: true,  grams: 0,   desc: 'Track a bin over 6 weeks',          learn: 'Organic waste, decomposition and nutrient cycles.' },
  seeds:   { name: 'Grow seedlings',       wet: true,  grams: 0,   desc: 'Herbs in a grounds mix',            learn: 'Soil health and how nitrogen feeds plant growth.' },
};

export const WEEKS = [
  { w: '19 Oct', outlook: 'Mostly sunny', hum: 68, dryCap: 8 },
  { w: '26 Oct', outlook: 'Heavy rain',   hum: 89, dryCap: 0 },
  { w: '2 Nov',  outlook: 'Showers',      hum: 80, dryCap: 4 },
  { w: '9 Nov',  outlook: 'Sunny',        hum: 66, dryCap: 10 },
];

export const COLLECTED = 80; // kg grounds collected per week

export const QUIZZES = [
  { t: 'Where does our waste go?', topic: 'Waste and recycling', icon: 'recycle', accent: 'teal', qs: [
    { q: 'In Singapore, most waste that is not recycled is burned. Where does the ash go?', o: ['Into the sea, untreated', 'To an offshore landfill', 'Into new roads'], a: 1 },
    { q: 'Which of these belongs in the blue recycling bin?', o: ['Greasy pizza box', 'Clean plastic bottle', 'Used tissue'], a: 1 },
  ] },
  { t: "Coffee's second life", topic: 'Circular economy', icon: 'cup', accent: 'amber', qs: [
    { q: 'About how many grams of used grounds does one cup leave?', o: ['2 g', '20 g', '200 g'], a: 1 },
    { q: 'Why can milk or chocolate powder ruin a batch of grounds?', o: ['It changes the colour', 'It can go mouldy and smell', 'It makes them heavier'], a: 1 },
  ] },
  { t: 'Food waste at home', topic: 'Food waste', icon: 'leaf', accent: 'leaf', qs: [
    { q: 'What does a "best before" date mean?', o: ['Unsafe after this date', 'Best quality before this date', 'Must be thrown away'], a: 1 },
    { q: 'Which leftover can go straight into compost?', o: ['Fruit peels', 'Chicken bones', 'Cooking oil'], a: 0 },
  ] },
  { t: 'Energy in everyday life', topic: 'Climate basics', icon: 'bolt', accent: 'brew', qs: [
    { q: 'Which saves the most energy?', o: ['Fan left on', 'Switching off at the wall', 'Charging overnight'], a: 1 },
    { q: 'Setting an air-con 1°C higher usually...', o: ['Uses more energy', 'Uses less energy', 'Makes no difference'], a: 1 },
  ] },
];

export const MISSIONS = [
  { t: 'Kitchen waste check',       who: 'With someone at home', icon: 'trash',  level: 'Easy',   mins: '1 evening', d: 'List everything your household throws away in one evening. Circle what could be composted.' },
  { t: 'Feed a plant with grounds', who: 'With someone at home', icon: 'sprout', level: 'Easy',   mins: '2 weeks',   d: "Mix a spoonful of used coffee grounds into a pot plant's soil and log how it grows for two weeks." },
  { t: 'Switch-off week',           who: 'Class or team',        icon: 'plug',   level: 'Medium', mins: '1 week',    d: 'Track how many devices are left on standby, then switch off at the wall for a week.' },
];

export const STORIES = [
  { pic: 'compost', name: 'Greenleaf Compost', kind: 'Composting farm', since: 'Partner since 2025', kg: '35 kg a week', grounds: 'Fresh grounds',
    quote: 'Coffee grounds are a steady source of nitrogen for our compost. Because pickups are on a fixed day, we plan our batches around them.' },
  { pic: 'fungi', name: 'Urban Fungi Co', kind: 'Mushroom grower', since: 'Partner since 2026', kg: '15 kg a week', grounds: 'Fresh grounds',
    quote: 'We grow oyster mushrooms on fresh grounds, so we need them within a day or two. Collecting straight from CoffeeBot works because nothing has to be dried.' },
  { pic: 'soap', name: 'Kopi Skin Lab', kind: 'Skincare maker', since: 'Applying now', kg: '8 kg a week', grounds: 'Dried grounds',
    quote: 'We only take dried, clean grounds. Knowing which batches are free of milk powder is what makes it possible for us to use them.' },
];

export const SEED = {
  bookings: [
    { id: 1, org: 'Riverside Primary',       act: 'compost', kg: 3, week: 0, people: 30 },
    { id: 2, org: 'Maple Grove Secondary',   act: 'scrub',   kg: 3, week: 0, people: 32 },
    { id: 3, org: 'Bayview Tower offices',   act: 'seeds',   kg: 2, week: 1, people: 18 },
    { id: 4, org: 'Harbourlight Primary',    act: 'planter', kg: 4, week: 3, people: 28 },
  ],
  partners: [
    { name: 'Greenleaf Compost', kind: 'Compost or gardening', cap: 35, wet: true },
    { name: 'Urban Fungi Co',    kind: 'Mushroom growing',     cap: 15, wet: true },
  ],
  requests: [
    { id: 101, name: 'Bloom Community Garden', kind: 'Compost or gardening', cap: 15, wet: true,  by: 'Public partner form' },
    { id: 102, name: 'Kopi Skin Lab',          kind: 'Skincare or soap',     cap: 8,  wet: false, by: 'Public partner form' },
  ],
  inbox: [{ from: 'Riverside Primary', topic: 'A booking', text: 'Can we add 5 more students to our compost session?' }],
  feed: [
    'Maple Grove Secondary booked coffee scrub jars',
    '14 families completed the kitchen waste check',
    'Bayview Tower ran an office quiz with 46 staff',
  ],
  reach: { people: 1420, families: 310, orgs: 6 },
  reusedYear: 4820,
  quizzesDone: 0,
  missionsAssigned: 0,
  missionsCompleted: 0,
  nextId: 200,
};
