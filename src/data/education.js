/* ============================================================
   CoffeeBot Education Hub: learning content.
   Two complete versions, picked from the account type:
     HUB.teacher  : schools: informal, fun and simple, written to be
                     read out or shown to students.
     HUB.corporate: workplaces: professional, framed around operations,
                     procurement and reporting.
   Structure (icons, step names, stage order) is shared; every word
   a reader sees comes from their own version.
   DRAFT COPY: written as placeholder text for the owner to review.
   Deliberately free of statistics: nothing here is a measured claim.
   ============================================================ */

/* shared structure: what each piece is, not what it says */
const PILLARS = [
  { k: 'env', icon: 'leaf', accent: 'leaf' },
  { k: 'soc', icon: 'users', accent: 'teal' },
  { k: 'eco', icon: 'recycle', accent: 'amber' },
];
const PRINCIPLE_ICONS = ['trash', 'recycle', 'bolt', 'award'];
const STAGE_ICONS = ['sprout', 'leaf', 'recycle', 'send', 'bolt', 'cup', 'trash'];
const STAGE_USES = [
  ['Land', 'Water', 'Sunlight', 'Sometimes fertiliser'],
  ['Human labour', 'Tools and transport on the farm'],
  ['Water (washed method)', 'Sun and time (natural method)', 'Energy for machinery'],
  ['Fuel', 'Packaging such as sacks and liners'],
  ['Heat energy (gas or electricity)', 'Packaging for the roasted beans'],
  ['Water', 'Electricity', 'Cups, lids and stirrers'],
  ['Collection and transport', 'Drying, for some uses'],
];
const STEPS = { linear: ['Take', 'Make', 'Use', 'Dispose'], circular: ['Take less', 'Make', 'Use', 'Collect', 'Reuse'] };

const zip = (meta, words) => meta.map((m, i) => ({ ...m, ...words[i] }));
const stages = (words) => words.map((w, i) => ({ icon: STAGE_ICONS[i], uses: STAGE_USES[i], ...w }));

/* ================= SCHOOLS ================= */
const SCHOOL = {
  eyebrow: 'Education Hub · for schools',
  title: 'Big ideas in a small cup of coffee',
  intro: 'Three bite-sized topics your students will actually enjoy, plus games, activities and questions to get the whole class talking.',
  tabs: [
    ['What is sustainability?', 'Planet, people, pockets'],
    ['Going in circles', 'Why loops beat lines'],
    ["A bean's big adventure", 'Seven stops, farm to cup'],
    ['Classroom corner', 'Activities & questions'],
  ],

  sustainability: {
    eyebrow: 'Topic 1 · What is sustainability?',
    definition: 'Sustainability means using what we need today, and still leaving plenty for everyone who comes after us.',
    detail: "Imagine sharing a pizza with friends who haven't arrived yet. If we eat it all now, there's nothing left for them! Being sustainable means being fair to the planet, fair to people, and making things that last.",
    pillarsTitle: 'The three big P’s',
    pillarsNote: 'A good idea looks after all three at once.',
    coffeeLabel: 'In your cup:',
    pillars: zip(PILLARS, [
      { name: 'Planet', what: "Looking after nature: clean water, healthy land and not making more rubbish than the Earth can cope with.",
        coffee: 'Coffee needs land, water and sunshine to grow. Even the leftover grounds are part of the story!' },
      { name: 'People', what: 'Treating everyone fairly: safe jobs, fair pay, and the chance to go to school.',
        coffee: 'Real people grow and pick coffee beans. Being sustainable means they get treated and paid fairly.' },
      { name: 'Pockets', what: "Using money wisely so homes, schools and businesses can keep going for a long time.",
        coffee: "Throwing grounds away costs money. Turning them into something useful is like finding treasure in the bin." },
    ]),
    whyTitle: 'Why should we care?',
    why: [
      ["There's only one Earth", "We can't order a new planet online! Water, land and energy have to be shared by everyone."],
      ['Little things add up', "One cup leaves a small spoonful of grounds. A whole school's worth, every single day, makes a mountain."],
      ['Everything is connected', 'What we buy, how we use it and where it goes next are all links in one chain.'],
    ],
    applyTitle: 'Try it in class',
    apply: [
      'Go on a detective mission: where do the coffee grounds from the staff room end up?',
      'Use the three P’s as a quick check: is an idea good for the planet, for people and for pockets?',
      'Do a one-day rubbish rescue: sort what the class throws away into avoid, reuse and recycle piles.',
      'Let students pitch one change for the school and say which P it helps the most.',
    ],
  },

  circular: {
    eyebrow: 'Topic 2 · Going in circles',
    definition: 'A circular economy is like a relay race that never ends: when one thing is finished, it passes the baton on to become something new.',
    modelsTitle: 'Slide or merry-go-round?',
    modelsNote: 'Tap each one to compare.',
    coffeeLabel: 'With coffee:',
    models: {
      linear: { label: 'Line (slide)', steps: STEPS.linear,
        text: 'Take it, make it, use it, bin it. Like a slide, you only go one way, and you land at the bottom, in the rubbish dump.',
        coffee: 'Coffee is made, the grounds go in the bin, and that’s the end. Bye-bye, grounds!' },
      circular: { label: 'Loop (merry-go-round)', steps: STEPS.circular,
        text: "Round and round! What's left over from one thing gets used again for something else, so far less ends up as rubbish.",
        coffee: 'Coffee is made, the grounds are collected, and they get a brand-new job, like helping plants grow.' },
    },
    principlesTitle: 'Four super-powers',
    principles: zip(PRINCIPLE_ICONS.map((icon) => ({ icon })), [
      { name: 'Reduce', text: "Use less in the first place. The best rubbish is rubbish you never made!", coffee: 'Only make as much as you’ll drink, and bring your own cup.' },
      { name: 'Reuse', text: 'Give things another go, for the same job or a totally new one.', coffee: 'Old grounds can become a body scrub, soap, or food for a compost heap.' },
      { name: 'Recycle', text: 'Break things down so they can be made into something new.', coffee: 'Clean paper cups and packaging go in the right recycling bin.' },
      { name: 'Make it last', text: 'Fix it, look after it, share it, so it stays useful for longer.', coffee: 'A coffee machine that gets cleaned and fixed lasts much longer.' },
    ]),
    groundsTitle: 'Grounds’ second jobs',
    grounds: [
      ['Compost', 'Mixed with dry leaves or cardboard, grounds help make rich soil for plants.'],
      ['Mushroom farms', 'Some growers use fresh grounds as a cosy bed for mushrooms to grow on.'],
      ['Scrubs and soap', 'Dried grounds give scrubs and soap a gentle, scratchy texture.'],
      ['Crafts and plant pots', 'Mixed with something sticky, grounds can be shaped into little pots.'],
    ],
    groundsNote: 'Grounds are just one ingredient, not the whole thing. They need to be clean and used quickly, because wet grounds go mouldy fast!',
    applyTitle: 'Spot it around you',
    apply: [
      ['At school', 'Put a grounds tub in the staff room and use it for a class compost bin or planting project.'],
      ['At home', 'Find one thing at home that gets reused, fixed or shared instead of thrown away.'],
      ['In a lesson', 'Give groups an everyday object and ask them to redraw its journey as a circle.'],
    ],
  },

  lifecycle: {
    eyebrow: "Topic 3 · A bean's big adventure",
    lead: 'Every coffee bean goes on a seven-stop adventure, from a farm far away all the way to your cup, and beyond!',
    detail: 'Tap a stop to see what it needs, what gets left over and how it could get a second life.',
    labels: { uses: 'What it needs', impact: 'Why it matters', waste: 'What gets left over', circular: 'Give it a second life' },
    stages: stages([
      { name: 'Growing', what: 'Coffee grows on bushes in hot places near the equator. A plant takes a few years before it grows red berries called coffee cherries.',
        impact: 'Sometimes forests are cut down to make room for farms. Farms that keep trees for shade are kinder to nature.',
        waste: 'Old leaves and twigs, which usually go back into the soil.', circular: 'Farm leftovers can be turned into compost and put back on the fields.' },
      { name: 'Picking', what: 'Ripe cherries are picked, often by hand, because berries on the same branch get ripe at different times.',
        impact: 'This is hard work! Pickers should be safe and paid fairly.',
        waste: 'Cherries that are too green or squashed.', circular: 'Those cherries can go in the compost instead of being dumped.' },
      { name: 'Processing', what: 'The fruit is taken off to find the seed inside. That seed is the coffee bean! Some farms wash the fruit off; others dry it in the sun.',
        impact: 'Washing uses lots of water, and dirty water has to be cleaned. Sun-drying uses much less water but takes longer.',
        waste: 'Fruit skins, pulp and dirty water.', circular: 'Pulp makes good compost, and dried fruit skins can even be made into a tea called cascara.' },
      { name: 'Travelling', what: 'The green beans are packed into big sacks and sent on ships across the world.',
        impact: 'Ships and trucks burn fuel, which puts gases into the air.',
        waste: 'Old sacks and packaging.', circular: 'Coffee sacks are tough, so people reuse them for gardening, storage and crafts.' },
      { name: 'Roasting', what: 'The beans are heated until they turn brown and smell like coffee.',
        impact: 'Roasting needs lots of heat, and it makes smoke.',
        waste: 'Chaff: a thin, papery skin that flakes off the beans.', circular: 'Chaff is light and dry, so it works well in compost or on garden beds.' },
      { name: 'Brewing', what: 'The beans are ground up and hot water runs through them. Only some of the bean ends up in the cup. The rest stays behind as grounds.',
        impact: 'Most of the bean is left over! Throwaway cups add even more rubbish.',
        waste: 'Used coffee grounds, plus cups and lids.', circular: 'Use a cup you can wash, and keep the grounds separate so they can be collected.' },
      { name: 'After the cup', what: 'The used grounds are either thrown in the bin or collected for a second life.',
        impact: 'In a rubbish dump, food scraps rot without air and give off a gas called methane, which warms the planet.',
        waste: 'The grounds themselves, unless we rescue them!', circular: 'This is where the loop closes: compost, mushrooms, scrubs, soap and plant pots all start with collected grounds.' },
    ]),
  },
};

/* ================= WORKPLACES ================= */
const WORKPLACE = {
  eyebrow: 'Education Hub · for organisations',
  title: 'Sustainability in practice, starting at the pantry',
  intro: 'Three concise briefings on sustainability, the circular economy and the coffee value chain, framed around your operations, procurement and reporting, plus scenarios and a first-month plan for your team.',
  tabs: [
    ['Sustainability fundamentals', 'Planet, people, profit'],
    ['The circular economy', 'From linear to circular'],
    ['The coffee value chain', 'Seven stages, mapped'],
    ['For your workplace', 'Practices & scenarios'],
  ],

  sustainability: {
    eyebrow: 'Briefing 1 · Sustainability fundamentals',
    definition: 'Sustainability means meeting present needs without compromising the ability of future generations to meet their own.',
    detail: 'For an organisation, this is the triple bottom line: environmental, social and economic performance managed together. Gains in one area that come at the expense of another rarely hold over time.',
    pillarsTitle: 'The three dimensions',
    pillarsNote: 'A decision is only sustainable when it holds up on all three.',
    coffeeLabel: 'In your pantry:',
    pillars: zip(PILLARS, [
      { name: 'Environmental', what: 'Using energy, water and materials at a rate that can be sustained, and keeping emissions, pollution and waste low.',
        coffee: 'The coffee your team drinks carries a footprint from farm to cup. What happens to the used grounds is part of that footprint.' },
      { name: 'Social', what: 'Fair and safe working conditions across your own operations and your supply chain, and a positive effect on the communities around you.',
        coffee: 'Coffee is grown by farming communities. Sourcing choices affect how those workers are paid and treated.' },
      { name: 'Economic', what: 'Long-term value creation that does not depend on waste, or on costs shifted onto others.',
        coffee: 'Disposing of grounds is a recurring cost. Diverting them to reuse can lower waste handling and create value elsewhere.' },
    ]),
    whyTitle: 'Why it matters for your organisation',
    why: [
      ['Resource and cost exposure', 'Energy, materials and waste handling are rising line items. Using less is a direct saving.'],
      ['Stakeholder expectations', 'Employees, clients and partners increasingly ask what organisations do, and expect evidence, not slogans.'],
      ['Habits compound', 'Daily routines such as the pantry run every working day. Small changes there scale across the whole organisation.'],
    ],
    applyTitle: 'Applying it at work',
    apply: [
      'Start with one routine (the pantry is a good choice) and map what comes in and what is thrown out.',
      'Assess decisions against all three dimensions, not cost alone: environmental effect, effect on people, long-term value.',
      'Put reusable cups and a separate grounds container where coffee is made, so the better choice is the easy one.',
      'Share results internally. Visible progress builds participation.',
    ],
  },

  circular: {
    eyebrow: 'Briefing 2 · The circular economy',
    definition: 'A circular economy keeps materials in productive use for as long as possible, designing out waste instead of managing it at the end.',
    modelsTitle: 'Linear or circular?',
    modelsNote: 'Switch between the two to compare.',
    coffeeLabel: 'In practice:',
    models: {
      linear: { label: 'Linear', steps: STEPS.linear,
        text: 'The conventional model: extract resources, manufacture, use, discard. Every product needs virgin inputs and every product ends as waste, with the cost of disposal borne by someone.',
        coffee: 'Coffee is brewed and the grounds go to general waste, where they are paid for as rubbish.' },
      circular: { label: 'Circular', steps: STEPS.circular,
        text: "Products and materials are designed for reuse. One process's by-product becomes another's input, reducing both virgin material demand and waste costs.",
        coffee: 'Grounds are separated at source, collected, and become an input for composting, growing or manufacturing.' },
    },
    principlesTitle: 'Four principles',
    principles: zip(PRINCIPLE_ICONS.map((icon) => ({ icon })), [
      { name: 'Reduce', text: 'Avoid waste at the source by specifying and buying only what is needed.', coffee: 'Right-size pantry orders and default to reusable cups.' },
      { name: 'Reuse', text: 'Keep products and materials in use, for the same purpose or a new one.', coffee: 'Route used grounds to partners who use them as an input.' },
      { name: 'Recycle', text: 'Recover materials so they can be manufactured into new products.', coffee: 'Ensure clean cups, lids and packaging reach the correct recycling stream.' },
      { name: 'Extend life', text: 'Maintain, repair and share assets so they stay in service longer.', coffee: 'A serviced coffee machine outlasts one that is replaced on failure.' },
    ]),
    groundsTitle: 'Reuse pathways for used grounds',
    grounds: [
      ['Compost', 'Grounds can form part of a balanced compost mix alongside drier materials.'],
      ['Mushroom cultivation', 'Some growers use fresh grounds as part of the substrate for oyster mushrooms.'],
      ['Personal-care products', 'Dried grounds can be the exfoliant in scrubs or soaps, combined with oils or a soap base.'],
      ['Crafts and planters', 'With a binder, grounds can be moulded into pots or used decoratively in candles.'],
    ],
    groundsNote: 'In each case the grounds are one input, not the whole product. They must be clean and handled promptly, as wet grounds spoil quickly. Treat reuse as an option to evaluate, not a guaranteed environmental benefit.',
    applyTitle: 'Where it applies in a business',
    apply: [
      ['Facilities', 'Separate pantry grounds from general waste so they can be collected and reused.'],
      ['Operations', 'Map one material your team discards regularly and identify who could use it as an input.'],
      ['Procurement', 'Prefer suppliers whose products can be refilled, repaired or returned over single-use alternatives.'],
    ],
  },

  lifecycle: {
    eyebrow: 'Briefing 3 · The coffee value chain',
    lead: 'Coffee passes through seven stages between the farm and the bin. Each has resource inputs, impacts and a circular opportunity.',
    detail: 'Select a stage to review its inputs, waste streams and the business angle.',
    labels: { uses: 'Resource inputs', impact: 'Impact', waste: 'Waste generated', circular: 'Circular opportunity', business: 'Business angle' },
    stages: stages([
      { name: 'Cultivation', what: 'Coffee is grown on shrubs in tropical regions. Plants take several years to bear fruit (coffee cherries).',
        impact: 'Land conversion can reduce forest cover, and fertiliser run-off affects waterways. Shade-grown, well-managed farms reduce these pressures.',
        waste: 'Prunings and leaf litter, usually returned to the soil.', circular: 'Farm residues can be composted back into the fields.',
        business: 'Sourcing standards and certifications are the main lever an organisation has at this stage.' },
      { name: 'Harvesting', what: 'Ripe cherries are picked, often by hand, because cherries on one branch ripen unevenly.',
        impact: 'The most visible social risk in the chain: working conditions and fair pay for pickers.',
        waste: 'Unripe or damaged cherries removed in sorting.', circular: 'Rejected cherries can be composted rather than dumped.',
        business: 'Ask suppliers how they verify labour conditions. This is a supply-chain due-diligence question.' },
      { name: 'Processing', what: 'The fruit is removed to reach the seed (the bean), either by washing (wet process) or by sun-drying the whole cherry (natural process).',
        impact: 'Wet processing uses significant water and produces wastewater that needs treatment. Natural processing uses far less water.',
        waste: 'Pulp, skins and wastewater.', circular: 'Pulp can be composted; dried cherry skins are sold as cascara tea.',
        business: 'Processing method affects the water footprint of what you buy.' },
      { name: 'Logistics', what: 'Green beans are bagged and shipped from producing countries to roasters worldwide.',
        impact: 'Long-distance freight burns fuel and generates emissions.',
        waste: 'Sacks, liners and packaging.', circular: 'Jute sacks are durable and widely reused for storage, landscaping and crafts.',
        business: 'Transport sits in your indirect (Scope 3) footprint if you report one.' },
      { name: 'Roasting', what: 'Heat turns green beans brown and develops flavour and aroma.',
        impact: 'Roasting is energy-intensive and produces smoke; energy source and filtration matter.',
        waste: 'Chaff: the papery skin shed during roasting.', circular: 'Chaff is dry and light, suitable for compost or mulch.',
        business: "A roaster's energy source is a fair question in supplier selection." },
      { name: 'Brewing', what: 'Beans are ground and hot water passed through them. Only the soluble part reaches the cup; the rest remains as used grounds.',
        impact: 'Most of the bean mass is left after brewing. Single-use cups add a waste stream per drink.',
        waste: 'Used grounds, plus cups and packaging.', circular: 'Default to reusable cups and separate the grounds for collection.',
        business: 'This is the stage your organisation controls directly, and where pantry changes show up first.' },
      { name: 'End of life', what: 'Used grounds go either to general waste or to collection for reuse.',
        impact: 'Landfilled food waste that breaks down without air can release methane, a potent greenhouse gas.',
        waste: 'The grounds themselves, unless diverted.', circular: 'Compost, mushroom cultivation, scrubs, soaps and planters all start with collected grounds.',
        business: 'Diverted kilograms are a concrete, reportable figure, and CoffeeBot logs them for you.' },
    ]),
  },
};

export const HUB = { teacher: SCHOOL, corporate: WORKPLACE };

/* ---------- D. Audience-specific resources ---------- */
export const TEACHER = {
  activities: [
    { title: 'Line or loop?', mins: 20, level: 'Ages 8+',
      text: 'Give each group one everyday product. They draw its journey as a straight line, then redraw it as a loop and explain what changed.' },
    { title: 'The bean journey relay', mins: 25, level: 'Ages 10+',
      text: 'Hand out the seven lifecycle stages on cards. Groups put them in order, then mark where waste appears and where it could be reused.' },
    { title: 'Three-pillar debate', mins: 30, level: 'Ages 12+',
      text: 'Pose a choice (disposable or reusable cups in the canteen) and have teams argue from the environmental, social and economic side.' },
  ],
  questions: [
    ['Where do you think used coffee grounds go after a drink is made?', 'Most are thrown out with general waste. Use this to introduce the idea that "away" is still a place.'],
    ['Which stage of the bean\'s journey surprised you most, and why?', 'There is no single right answer. Listen for students noticing resources they had not thought about, such as water or transport.'],
    ['Can something be good for the environment but unfair to people? Give an example.', 'This draws out the three pillars: a solution that ignores people or cost is unlikely to last.'],
    ['What is one thing in our classroom that follows the "take, make, dispose" pattern? How could we make it circular?', 'Guide students towards reduce and reuse before recycle.'],
  ],
  tips: [
    'Bring a small tub of used grounds so students can see, touch and smell the material being discussed.',
    'Ask students to predict before you explain. It shows you what they already believe.',
    'Link each idea to a choice students actually make: what they pack for lunch, what they throw away.',
    'Finish with one action the class will try for a week, then check back on it.',
  ],
};

export const CORPORATE = {
  practices: [
    ['Pantry and coffee', 'Reusable cups by default, a labelled container for used grounds, and a regular collection.'],
    ['Waste reduction', 'Check what is thrown away in one week. The biggest items are the best places to start.'],
    ['Resource use', 'Switch equipment off at the wall after hours and set printers to double-sided by default.'],
    ['Corporate responsibility', 'Report what you actually did, with honest figures. Small verified results build more trust than large claims.'],
  ],
  scenarios: [
    { title: 'The pantry bin',
      text: 'Your floor drinks a lot of coffee. The grounds go into the general waste bin, which is full by mid-afternoon.',
      options: [
        ['Order a bigger bin', false, 'This handles the symptom. The same amount of material is still thrown away.'],
        ['Add a separate container for grounds and arrange collection', true, 'Separating at the source is what makes reuse possible, and it frees up the general bin as well.'],
        ['Ask people to drink less coffee', false, 'Reducing can help, but this is unlikely to stick and ignores a material that could be reused.'],
      ] },
    { title: 'The supplier choice',
      text: 'Two suppliers offer the same product. One is slightly cheaper; the other takes back and refills its packaging.',
      options: [
        ['Choose on price alone', false, 'Price matters, but disposal has a cost too, and it does not appear on the quote.'],
        ['Compare total cost, including disposal, and how each fits your sustainability goals', true, 'Looking at the full picture (environmental, social and economic) is the three-pillar approach.'],
        ['Always choose the "green" option', false, 'A label is not evidence. Ask what actually happens to the packaging.'],
      ] },
    { title: 'The sustainability report',
      text: 'Your team diverted some pantry waste this quarter. A colleague suggests describing it as "zero waste" in the company update.',
      options: [
        ['Go with "zero waste", it sounds better', false, 'Overstating a result is greenwashing, and it undermines trust in everything else you report.'],
        ['Report what was measured, and what was not', true, 'Specific, honest reporting is more credible and gives you a baseline to improve on.'],
        ['Leave it out to be safe', false, 'Real progress is worth sharing. It encourages others to take part.'],
      ] },
  ],
  actions: [
    'Name one person to look after pantry waste on each floor.',
    'Put a grounds container next to every coffee machine.',
    'Run a short quiz at a team meeting to build awareness.',
    'Book a hands-on activity as a team session.',
    'Review progress after a month and share the result.',
  ],
};
